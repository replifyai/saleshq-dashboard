'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, BookOpen, GraduationCap, FileText, Maximize2, PlayCircle, Clock, CheckCircle2 } from 'lucide-react';
import { moduleApi, type Module, type ModuleFile, type QuizQuestion, type SubModule } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';
import ModuleQuiz from './ModuleQuiz';
import PdfViewer from './PdfViewer';

interface ModuleDetailProps {
  moduleId: string;
}

export default function ModuleDetail({ moduleId }: ModuleDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState<Module | null>(null);
  const [files, setFiles] = useState<ModuleFile[]>([]);
  const [pdfFiles, setPdfFiles] = useState<ModuleFile[]>([]);
  const [quizFiles, setQuizFiles] = useState<ModuleFile[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<ModuleFile | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<ModuleFile | null>(null);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'test'>('knowledge');
  const [hideTabs, setHideTabs] = useState(false);
  const [subModules, setSubModules] = useState<SubModule[]>([]);

  useEffect(() => {
    fetchModuleDetails();
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      const response = await moduleApi.getModule(moduleId);
      setModule(response.data.module);
      setFiles(response.data.files || []);
      setSubModules(response.data.subModules || []);

      // Separate PDF and Quiz files
      const pdfs = response.data.files.filter(file => file.type === 'pdf');
      const quizzes = response.data.files.filter(file => file.type === 'quiz');

      setPdfFiles(pdfs);
      setQuizFiles(quizzes);

      // Auto-select first PDF if available
      if (pdfs.length > 0) {
        setSelectedPdf(pdfs[0]);
      }
    } catch (error) {
      toast({
        title: "Error fetching module",
        description: error instanceof Error ? error.message : "Failed to load module details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (moduleId.includes('/')) {
      const parentPath = moduleId.split('/').slice(0, -1).join('/');
      router.push(`/modules/${parentPath}`);
    } else {
      router.push('/practice');
    }
  };

  const handleStartQuiz = (quiz: ModuleFile) => {
    setSelectedQuiz(quiz);
    setActiveTab('test');
  };

  const handleQuizBack = () => {
    setSelectedQuiz(null);
    setHideTabs(false);
  };

  const handlePdfSelect = (pdf: ModuleFile) => {
    setSelectedPdf(pdf);
  };
  const handleFullscreen = () => {
    const element = document.getElementById('pdf-viewer-container');
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-2">
      {/* Sticky Header with minimal info */}
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {/* <div className="min-w-0 flex-1 px-2 truncate">
          <h1 className="text-base font-semibold truncate">
            {module?.name}
          </h1>
          <p className="text-xs text-gray-500 truncate">{module?.description}</p>
        </div> */}
      </div>

      {/* Tabs with compact list */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'knowledge' | 'test')}>
        {/* {!hideTabs && (
          <div className="flex items-center justify-between mb-2">
            <TabsList className="mb-2">
              <TabsTrigger value="knowledge" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Knowledge
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Test
              </TabsTrigger>
            </TabsList>
          </div>
        )} */}
        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 h-full">
            {/* Side Panel: Hierarchical Files and Submodules */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm">
                    <div className="min-w-0 flex-1 truncate">
                      <h1 className="text-base font-semibold truncate">{module?.name}</h1>
                      <p className="text-xs text-gray-500 truncate">{module?.description}</p>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {pdfFiles.length} PDF{pdfFiles.length === 1 ? '' : 's'} · {quizFiles.length} {quizFiles.length === 1 ? 'quiz' : 'quizzes'} · {subModules.length} submodule{subModules.length === 1 ? '' : 's'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-full">
                    <div className="p-2 space-y-3">
                      {/* Files Section */}
                      <div>
                        <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-gray-500">Files</div>
                        {/* PDFs */}
                        {pdfFiles.length > 0 && (
                          <div className="mt-1">
                            <div className="px-2 text-xs text-gray-500">PDFs · {pdfFiles.length}</div>
                            <div className="mt-1 space-y-1">
                              {pdfFiles.map((pdf) => (
                                <Button
                                  key={pdf.id}
                                  variant={selectedPdf?.id === pdf.id ? "secondary" : "ghost"}
                                  className="w-full justify-start h-9"
                                  onClick={() => handlePdfSelect(pdf)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  <span className="truncate text-sm">{pdf.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quizzes */}
                        {quizFiles.length > 0 && (
                          <div className="mt-3">
                            <div className="px-2 text-xs text-gray-500">Quizzes · {quizFiles.length}</div>
                            <div className="mt-1 space-y-1">
                              {quizFiles.map((quiz) => (
                                <Button
                                  key={quiz.id}
                                  variant="ghost"
                                  className="w-full justify-start h-9"
                                  onClick={() => handleStartQuiz(quiz)}
                                >
                                  <GraduationCap className="h-4 w-4 mr-2" />
                                  <span className="truncate text-sm">{quiz.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submodules Section */}
                      {subModules.length > 0 && (
                        <div className="mt-2">
                          <div className="px-2 py-1 text-[11px] uppercase tracking-wide text-gray-500">Submodules · {subModules.length}</div>
                          <div className="mt-1 space-y-1">
                            {subModules.map((sm) => (
                              <Button
                                key={sm.id}
                                variant="ghost"
                                className="w-full justify-start h-9"
                                onClick={() => router.push(`/modules/${module?.id}/${sm.id}`)}
                              >
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span className="truncate text-sm">{sm.name}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* PDF Viewer - fills available height */}
            <div className="lg:col-span-4">
              {selectedPdf ? (
                <Card className="h-[calc(100vh-5.5rem)]">
                  <CardContent className="h-[calc(100%-2.5rem)] p-0">
                    <PdfViewer file={selectedPdf} />
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[calc(100vh-5.5rem)] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {pdfFiles.length === 0 ? 'No learning materials' : 'Select a PDF to view'}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="min-h-[calc(100vh-7rem)]">
          {selectedQuiz ? (
            <ModuleQuiz
              moduleId={moduleId}
              quizFile={selectedQuiz}
              onBack={handleQuizBack}
              onResultsVisibilityChange={(visible) => setHideTabs(visible)}
            />
          ) : (
            <>
              {quizFiles.length === 0 ? (
                <Card className="p-12 text-center">
                  <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Tests Available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    No quizzes have been created for this module yet.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizFiles.map((quiz) => (
                        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {quiz.questionsCount} questions
                              </span>
                            </div>
                            <CardTitle className="text-lg truncate">{quiz.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                ~{Math.ceil((quiz.questionsCount || 10) * 1.5)} mins
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Multiple Choice
                              </span>
                            </div>
                            <Button
                              className="w-full"
                              onClick={() => handleStartQuiz(quiz)}
                            >
                              <PlayCircle className="h-4 w-4 mr-2" />
                              Start Test
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}