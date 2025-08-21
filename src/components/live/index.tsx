'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mic, MicOff, RefreshCcw, Volume2, Pin, PinOff, Copy } from "lucide-react";
import { authService } from "@/lib/auth";
import { getWsUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type WsState = "disconnected" | "connecting" | "connected";

interface TranscriptItem {
  id: string;
  text: string;
  at: number;
  suggestions: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function floatTo16BitPCM(float32Array: Float32Array): Int16Array {
  const out = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = clamp(float32Array[i], -1, 1);
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function resampleMono(input: Float32Array, inputSampleRate: number, outputSampleRate: number): Float32Array {
  if (inputSampleRate === outputSampleRate) return input;
  const ratio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(input.length / ratio);
  const result = new Float32Array(newLength);
  let pos = 0;
  for (let i = 0; i < newLength; i++) {
    const idx = i * ratio;
    const idxFloor = Math.floor(idx);
    const idxCeil = Math.min(input.length - 1, Math.ceil(idx));
    const weight = idx - idxFloor;
    const sample = input[idxFloor] * (1 - weight) + input[idxCeil] * weight;
    result[pos++] = sample;
  }
  return result;
}

export default function LiveTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [wsState, setWsState] = useState<WsState>("disconnected");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [liveText, setLiveText] = useState("");
  const [history, setHistory] = useState<TranscriptItem[]>([]);
  const [speechActive, setSpeechActive] = useState(false);
  const [source, setSource] = useState<"mic" | "tab">("mic");
  const [provider, setProvider] = useState<"openai" | "deepgram">("openai");
  const [format, setFormat] = useState<"pcm16" | "opus-webm">("pcm16");
  const [language, setLanguage] = useState<string>("en");
  const [liveSuggestion, setLiveSuggestion] = useState("");
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const currentSuggestionsRef = useRef<string[]>([]);
  const awaitingNextSegmentRef = useRef(false);
  const lastHistoryIdRef = useRef<string | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [pinnedSuggestions, setPinnedSuggestions] = useState<string[]>([]);
  const [historyFilter, setHistoryFilter] = useState("");
  const liveScrollRef = useRef<HTMLDivElement | null>(null);
  const suggestionsScrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const appendSuggestion = useCallback((text: string) => {
    const suggestionText = (text || "").trim();
    if (!suggestionText) return;
    setLiveSuggestion(suggestionText);

    // If we just completed a segment and haven't started the next one yet,
    // attach suggestions to the last history item instead of the new buffer.
    if (awaitingNextSegmentRef.current && lastHistoryIdRef.current) {
      const historyId = lastHistoryIdRef.current;
      setHistory((prev) => {
        return prev.map((h) => {
          if (h.id !== historyId) return h;
          const suggestions = h.suggestions || [];
          if (suggestions.length > 0 && suggestions[suggestions.length - 1] === suggestionText) {
            return h;
          }
          return { ...h, suggestions: [...suggestions, suggestionText] };
        });
      });
      return;
    }

    // Otherwise, add to the current in-progress segment buffer
    setCurrentSuggestions((prev) => {
      if (prev.length > 0 && prev[prev.length - 1] === suggestionText) {
        currentSuggestionsRef.current = prev;
        return prev;
      }
      const next = [...prev, suggestionText];
      currentSuggestionsRef.current = next;
      return next;
    });
  }, []);

  const cleanupAudio = useCallback(() => {
    try {
      processorRef.current?.disconnect();
    } catch { }
    try {
      sourceNodeRef.current?.disconnect();
    } catch { }
    try {
      audioContextRef.current?.close();
    } catch { }

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current = null;
    sourceNodeRef.current = null;
    mediaStreamRef.current = null;
    audioContextRef.current = null;
  }, []);

  const cleanupWs = useCallback(() => {
    try {
      wsRef.current?.close();
    } catch { }
    wsRef.current = null;
    setWsState("disconnected");
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: "stop_transcription" }));
      } catch { }
    }
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch { }
    cleanupAudio();
    cleanupWs();
  }, [cleanupAudio, cleanupWs]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    setLiveText("");
    setSpeechActive(false);
    setLiveSuggestion("");
    setCurrentSuggestions([]);
    currentSuggestionsRef.current = [];

    // 1) Get auth token for WS handshake
    const token = await authService.getAccessToken();
    if (!token) {
      setPermissionError("Not authenticated");
      return;
    }

    // 2) Prepare audio
    try {
      let stream: MediaStream;
      if (source === "mic") {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            noiseSuppression: true,
          },
        });
      } else {
        // Capture audio from another browser tab via display media (user must check "Share tab audio")
        const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
          },
        });

        // Try to stop video track immediately to save resources; keep audio tracks
        displayStream.getVideoTracks().forEach((t: MediaStreamTrack) => t.stop());

        const audioTracks = displayStream.getAudioTracks();
        if (!audioTracks || audioTracks.length === 0) {
          // User likely didn't check "Share tab audio"
          displayStream.getTracks().forEach((t: MediaStreamTrack) => t.stop());
          throw new Error("No tab audio captured. In the picker, select a tab and check 'Share tab audio'.");
        }

        // Build a MediaStream with only the audio tracks
        stream = new MediaStream();
        audioTracks.forEach((t: MediaStreamTrack) => stream.addTrack(t));

        // End session gracefully if user stops sharing
        audioTracks.forEach((t: MediaStreamTrack) => {
          t.addEventListener("ended", () => {
            stopRecording();
          });
        });
      }

      mediaStreamRef.current = stream;

      // 3) Open WS
      setWsState("connecting");
      const wsUrl = getWsUrl(`/ws/realtime-transcription?token=${encodeURIComponent(token)}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsState("connected");
        try {
          // Choose start options based on provider/format
          if (provider === "deepgram") {
            if (format === "opus-webm") {
              ws.send(
                JSON.stringify({
                  type: "start_transcription",
                  options: {
                    provider: "deepgram",
                    language: language || "en",
                    audioEncoding: "opus",
                    audioContainer: "webm",
                    sampleRate: 48000,
                    channels: 1,
                    model: language === "en" ? "nova-3" : "nova-2",
                  },
                })
              );
            } else {
              // PCM16 base64 streaming
              ws.send(
                JSON.stringify({
                  type: "start_transcription",
                  options: {
                    provider: "deepgram",
                    language: language,
                    audioEncoding: "pcm16",
                    sampleRate: 16000,
                    channels: 1,
                    model: language === "en" ? "nova-3" : "nova-2",
                  },
                })
              );
            }
          } else {
            // Default OpenAI whisper path
            ws.send(
              JSON.stringify({
                type: "start_transcription",
                options: { model: "whisper-1", provider: "openai" },
              })
            );
          }
        } catch { }
      };

      ws.onerror = () => {
        setPermissionError("WebSocket error");
        stopRecording();
      };

      ws.onclose = () => {
        setWsState("disconnected");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case "transcription.delta":
              // A new segment has started if we were awaiting the next one
              if (awaitingNextSegmentRef.current) {
                awaitingNextSegmentRef.current = false;
              }
              setLiveText((prev) => prev + (msg.delta || ""));
              if (autoScroll && liveScrollRef.current) {
                const el = liveScrollRef.current;
                el.scrollTop = el.scrollHeight;
              }
              break;
            case "transcription.completed":
              if (msg.transcript) {
                // Prefer suggestions sent with the completion payload if available
                let suggestionsForSegment: string[] = [];
                if (Array.isArray(msg.suggestions)) {
                  suggestionsForSegment = msg.suggestions
                    .map((s: any) => typeof s === "string" ? s : (s?.text || s?.suggestion || ""))
                    .filter((s: string) => !!s && typeof s === "string");
                } else {
                  suggestionsForSegment = currentSuggestionsRef.current || [];
                }
                // If still empty but we have a latest live suggestion, include it
                if (suggestionsForSegment.length === 0 && liveSuggestion) {
                  suggestionsForSegment = [liveSuggestion];
                }
                const newId = `${Date.now()}`;
                setHistory((prev) => [
                  { id: newId, text: msg.transcript, at: Date.now(), suggestions: [...suggestionsForSegment] },
                  ...prev,
                ]);
                lastHistoryIdRef.current = newId;
              }
              setLiveText("");
              setLiveSuggestion("");
              setCurrentSuggestions([]);
              currentSuggestionsRef.current = [];
              // We are between segments now; suggestions that arrive next belong to the just-completed transcript
              awaitingNextSegmentRef.current = true;
              break;
            case "assistant.suggestion":
            case "assistant.suggestion.delta":
              {
                const suggestionText = msg.suggestion || msg.text || "";
                appendSuggestion(suggestionText);
                if (autoScroll && suggestionsScrollRef.current) {
                  const el = suggestionsScrollRef.current;
                  el.scrollTop = el.scrollHeight;
                }
              }
              break;
            case "speech.started":
              setSpeechActive(true);
              break;
            case "speech.stopped":
              setSpeechActive(false);
              break;
            case "error":
              setPermissionError(msg.message || "Transcription error");
              break;
          }
          // Generic fallback ingestion: if a message carries suggestion(s) but with a different type
          if (msg && !msg.type) {
            if (typeof msg.suggestion === "string") {
              appendSuggestion(msg.suggestion);
            }
            if (Array.isArray(msg.suggestions)) {
              msg.suggestions.forEach((s: any) => appendSuggestion(typeof s === "string" ? s : (s?.text || s?.suggestion || "")));
            }
          }
        } catch { }
      };

      // 4) Audio pipeline depending on format
      if (provider === "deepgram" && format === "opus-webm") {
        // Use MediaRecorder to capture WebM/Opus chunks
        const mimeType = 'audio/webm;codecs=opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          setPermissionError("Browser does not support WebM/Opus recording");
          stopRecording();
          return;
        }
        const recorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = async (e: BlobEvent) => {
          try {
            if (!e.data || e.data.size === 0) return;
            const wsCurrent = wsRef.current;
            if (!wsCurrent || wsCurrent.readyState !== WebSocket.OPEN) return;
            const buf = await e.data.arrayBuffer();
            const base64 = uint8ToBase64(new Uint8Array(buf));
            wsCurrent.send(
              JSON.stringify({
                type: "audio_binary",
                encoding: "base64",
                data: base64,
              })
            );
          } catch { }
        };
        recorder.start(250);
        setIsRecording(true);
      } else {
        // Fallback / default: PCM16 base64 via ScriptProcessor
        const targetSampleRate = 16000; // recommended for PCM16
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: targetSampleRate,
        });
        const sourceNode = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(1024, 1, 1);

        audioContextRef.current = audioContext;
        sourceNodeRef.current = sourceNode;
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const ctx = audioContextRef.current;
          const wsCurrent = wsRef.current;
          if (!ctx || !wsCurrent || wsCurrent.readyState !== WebSocket.OPEN) return;

          const mono = ctx.sampleRate === targetSampleRate
            ? inputData
            : resampleMono(inputData, ctx.sampleRate, targetSampleRate);

          const pcm16 = floatTo16BitPCM(mono);
          const bytes = new Uint8Array(pcm16.buffer);
          const base64 = uint8ToBase64(bytes);

          try {
            wsCurrent.send(JSON.stringify({ type: "audio_data", audio: base64 }));
          } catch { }
        };

        sourceNode.connect(processor);
        processor.connect(audioContext.destination);
        setIsRecording(true);
      }
    } catch (err: any) {
      setPermissionError(err?.message || "Audio capture failed");
      stopRecording();
    }
  }, [stopRecording, source, provider, format, language]);

  return (
    <div className="h-full w-full p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" /> Live Transcription
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={wsState === "connected" ? "default" : "secondary"}>
                {wsState}
              </Badge>
              {/* <Badge variant={speechActive ? "default" : "secondary"}>
                {speechActive ? <span className="inline-flex items-center gap-1"><Mic className="h-3.5 w-3.5" /> Listening</span> : <span className="inline-flex items-center gap-1"><MicOff className="h-3.5 w-3.5" /> Idle</span>}
              </Badge> */}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Audio Source</div>
              <Select value={source} onValueChange={(v) => setSource(v as any)}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mic">Microphone</SelectItem>
                  <SelectItem value="tab">Browser Tab (Share tab audio)</SelectItem>
                </SelectContent>
              </Select>
              <Separator orientation="vertical" className="h-6" />
              <div className="text-sm text-muted-foreground">Provider</div>
              <Select value={provider} onValueChange={(v) => setProvider(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="deepgram">Deepgram</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">Format</div>
              <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Audio format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcm16">PCM16 Base64</SelectItem>
                  <SelectItem value="opus-webm">WebM/Opus</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">Language</div>
              <Select value={language} onValueChange={(v) => setLanguage(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Lang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!isRecording ? (
                <Button onClick={startRecording}>
                  <Mic className="h-4 w-4 mr-2" /> Start Listening
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopRecording}>
                  <MicOff className="h-4 w-4 mr-2" /> Stop
                </Button>
              )}
              <Button variant="ghost" onClick={() => { setLiveSuggestion(""); setCurrentSuggestions([]); }}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Clear Suggestions
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant={isRecording ? "default" : "secondary"}>
                  {isRecording ? (
                    <span className="inline-flex items-center gap-1"><Mic className="h-3.5 w-3.5" /> Listening</span>
                  ) : (
                    <span className="inline-flex items-center gap-1"><MicOff className="h-3.5 w-3.5" /> Idle</span>
                  )}
                </Badge>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="text-sm text-muted-foreground">Auto-scroll</div>
                <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
              </div>
            </div>

            {permissionError && (
              <div className="text-sm text-red-600">{permissionError}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              <div className="border rounded-md p-3 bg-muted/40">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-muted-foreground">AI Suggestions</div>
                  <Badge variant="secondary">{currentSuggestions.length}</Badge>
                </div>
                <ScrollArea className="h-48">
                  <div ref={suggestionsScrollRef} className="min-h-[5rem] space-y-2 pr-3">
                    {!!liveSuggestion && (
                      <div className="rounded-md border bg-background p-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">Latest</div>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost" onClick={() => {
                                    setPinnedSuggestions((prev) => prev.includes(liveSuggestion) ? prev : [...prev, liveSuggestion]);
                                    toast({ title: 'Pinned', description: 'Suggestion pinned for quick access' });
                                  }}>
                                    <Pin className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Pin</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost" onClick={async () => {
                                    await navigator.clipboard.writeText(liveSuggestion);
                                    toast({ title: 'Copied', description: 'Suggestion copied to clipboard' });
                                  }}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap mt-1">{liveSuggestion}</div>
                      </div>
                    )}
                    {currentSuggestions.length > 0 && (
                      <div>
                        <div className="text-xs text-muted-foreground">All in this segment</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {currentSuggestions.map((s, idx) => (
                            <li key={idx} className="whitespace-pre-wrap">{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {currentSuggestions.length === 0 && !liveSuggestion && (
                      <div className="text-sm text-muted-foreground">No suggestions yet</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {pinnedSuggestions.length > 0 && (
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">Pinned Suggestions</div>
                  <Badge variant="secondary">{pinnedSuggestions.length}</Badge>
                </div>
                <Separator className="my-2" />
                <ul className="list-disc pl-5 space-y-1">
                  {pinnedSuggestions.map((s, idx) => (
                    <li key={`${s}-${idx}`} className="flex items-start gap-2">
                      <span className="whitespace-pre-wrap flex-1">{s}</span>
                      <div className="shrink-0 flex gap-1">
                        <Button size="icon" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(s); toast({ title: 'Copied', description: 'Pinned suggestion copied' }); }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setPinnedSuggestions((prev) => prev.filter((x) => x !== s))}>
                          <PinOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>History</CardTitle>
              <div className="flex items-center gap-2 w-full max-w-xs">
                <Input placeholder="Filter suggestions or text" value={historyFilter} onChange={(e) => setHistoryFilter(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.length === 0 && (
              <div className="text-sm text-muted-foreground">No transcripts yet</div>
            )}
            <Accordion type="single" collapsible className="w-full">
              {history
                .filter((h) => {
                  if (!historyFilter.trim()) return true;
                  const q = historyFilter.toLowerCase();
                  return (
                    h.text.toLowerCase().includes(q) ||
                    (h.suggestions || []).some((s) => s.toLowerCase().includes(q))
                  );
                })
                .map((h) => (
                  <AccordionItem value={h.id} key={h.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{new Date(h.at).toLocaleTimeString()}</Badge>
                        <span className="line-clamp-1 text-left">{h.text}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="whitespace-pre-wrap">{h.text}</div>
                        {h.suggestions && h.suggestions.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-muted-foreground mb-1">Suggestions ({h.suggestions.length})</div>
                            <ul className="list-disc pl-5 space-y-1">
                              {h.suggestions.map((s, idx) => (
                                <li key={idx} className="whitespace-pre-wrap">{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

