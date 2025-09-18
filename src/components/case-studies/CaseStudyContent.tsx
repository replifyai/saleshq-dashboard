"use client";

import { MarkdownRenderer } from "./MarkdownRenderer";

interface CaseStudyContentProps {
  content: string;
}

export function CaseStudyContent({ content }: CaseStudyContentProps) {
  return <MarkdownRenderer content={content} />;
}