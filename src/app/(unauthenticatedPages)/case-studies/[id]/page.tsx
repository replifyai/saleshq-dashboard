import { notFound } from 'next/navigation';
import { CaseStudyDetail } from '@/components/case-studies/CaseStudyDetail';
import { caseStudyData } from '@/components/case-studies/caseStudyData';

interface CaseStudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const caseStudy = caseStudyData.find(study => study.id === id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <CaseStudyDetail caseStudy={caseStudy} />
    </div>
  );
}

export async function generateStaticParams() {
  return caseStudyData.map((study) => ({
    id: study.id,
  }));
}