"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { qaPairsApi, queriesApi, chatApi, type UnansweredQuery } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, FileText, MessageSquarePlus } from "lucide-react";

interface ResolveWithTextDialogProps {
  trigger?: React.ReactNode;
  query: UnansweredQuery;
  onSuccess?: () => void;
}

export function ResolveWithTextDialog({ trigger, query, onSuccess }: ResolveWithTextDialogProps) {
  console.log("🚀 ~ ResolveWithTextDialog ~ query:", query?.productName);
  const [isOpen, setIsOpen] = useState(false);
  const [filename, setFilename] = useState("support_qa.txt");
  const [answer, setAnswer] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["productsBasic"],
    queryFn: () => chatApi.getProductsBasic(),
    enabled: isOpen,
  });

  // Set the initial product when dialog opens or query changes
  useEffect(() => {
    if (isOpen && query?.productName) {
      setSelectedProductId(query.productName);
    }
  }, [isOpen, query?.productName]);

  console.log("🚀 ~ ResolveWithTextDialog ~ selectedProductId:", selectedProductId);

  const productName = useMemo(() => {
    if (customProductName.trim()) return customProductName.trim();
    const found = products?.find((p) => p.id === selectedProductId);
    return found?.name || "";
  }, [customProductName, selectedProductId, products]);
  useEffect(() => {
    if (!isOpen) {
      // reset form when closed
      setFilename("support_qa.txt");
      setAnswer("");
      setSelectedProductId("");
      setCustomProductName("");
    }
  }, [isOpen]);

  const resolveMutation = useMutation({
    mutationFn: async () => {
      // First create QA pair
      await qaPairsApi.createQAPairs({
        id: query.id,
        answer: answer.trim(),
        productId: selectedProductId
      });

      // Then mark as resolved in the system
      await queriesApi.markAsResolved(query.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/unanswered-queries"] });
      toast({
        title: "Resolved with answer",
        description: "The QA pair was saved and the query was marked as resolved.",
      });
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({
        title: "Failed to resolve",
        description: err?.message || "Could not save QA pair.",
        variant: "destructive",
      });
    },
  });

  const canSubmit = answer.trim().length > 0 && selectedProductId.trim().length > 0 && !resolveMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm" className="rounded-lg bg-green-600 text-white hover:bg-green-700" title="Resolve with text">
            <MessageSquarePlus className="w-4 h-4" />
            {/* Answer */}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Resolve with text
          </DialogTitle>
          <DialogDescription>
            Provide an answer for the user query. This will be added to the knowledge base and the query will be marked as resolved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Query</Label>
            <div className="text-sm p-2 rounded-md bg-muted">{query.message}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} placeholder="Write a detailed answer here. Make sure to mention the specific product name and provide clear instructions..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* <div className="space-y-2">
              <Label htmlFor="filename" className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> Filename
              </Label>
              <Input id="filename" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="support_qa.txt" />
            </div> */}

            <div className="space-y-2 col-span-2">
              <Label>Product *</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={isLoadingProducts}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingProducts ? "Loading..." : "Select product"} />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search products..." noResultsText="No products found">
                  {(products || []).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* <Input
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Or enter a new product name"
              /> */}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={resolveMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={() => resolveMutation.mutate()} disabled={!canSubmit} className="rounded-lg">
              {resolveMutation.isPending ? "Saving..." : "Save & Resolve"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ResolveWithTextDialog;

