'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Maximize2, 
  PlayCircle, 
  ChevronRight,
  Users,
  Eye
} from 'lucide-react';
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
      router.push(`/practice/modules/${parentPath}`);
    } else {
      // At root level module, go back to practice center
      router.push('/practice');
    }
  };

  const handleStartQuiz = (quiz: ModuleFile) => {
    setSelectedQuiz(quiz);
  };

  const handleQuizBack = () => {
    setSelectedQuiz(null);
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

  // Calculate progress metrics
  const totalContent = pdfFiles.length + quizFiles.length;
  const completedContent = 0; // This would come from user progress tracking
  const progressPercentage = totalContent > 0 ? (completedContent / totalContent) * 100 : 0;

  // Generate breadcrumb path
  const generateBreadcrumb = () => {
    const pathSegments = moduleId.split('/');
    return pathSegments.map((segment, index) => ({
      name: segment,
      path: pathSegments.slice(0, index + 1).join('/'),
      isLast: index === pathSegments.length - 1
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96 mb-4" />
            <Skeleton className="h-6 w-64" />
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbs = generateBreadcrumb();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header with Breadcrumbs */}
        <header className="mb-8" role="banner">
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBackClick}
                  className="h-8 px-2"
                  aria-label="Go back to modules"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                  {crumb.isLast ? (
                    <span className="font-medium text-foreground" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/practice/modules/${crumb.path}`)}
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                      {crumb.name}
                    </Button>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Module Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-foreground mb-2 truncate" id="module-title">
                {module?.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {module?.description}
              </p>
              
              {/* Progress and Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{pdfFiles.length}</span>
                    <span className="text-muted-foreground">Materials</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{quizFiles.length}</span>
                    <span className="text-muted-foreground">Assessments</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{subModules.length}</span>
                    <span className="text-muted-foreground">Submodules</span>
                  </div>
                </div>
                {/* {totalContent > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">{Math.round(progressPercentage)}%</span>
                      <span className="text-muted-foreground">Complete</span>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {selectedPdf && (
                <Button variant="outline" size="sm" onClick={handleFullscreen} className="gap-2">
                  <Maximize2 className="h-4 w-4" />
                  Fullscreen
                </Button>
              )}
            </div> */}
          </div>

          {/* Progress Bar */}
          {/* {totalContent > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Learning Progress</span>
                <span>{completedContent} of {totalContent} completed</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )} */}
        </header>

        {/* Main Content */}
        <main role="main">
          {selectedQuiz ? (
            <ModuleQuiz
              moduleId={moduleId}
              quizFile={selectedQuiz}
              onBack={handleQuizBack}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Enhanced Sidebar */}
              <aside className="lg:col-span-1" role="complementary" aria-label="Module navigation">
                <Card className="sticky top-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Module Content
                    </CardTitle>
                    <CardDescription>
                      Navigate through learning materials, assessments, and submodules
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Learning Materials Section */}
                    {pdfFiles.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            Learning Materials
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {pdfFiles.length}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {pdfFiles.map((pdf, index) => (
                            <Button
                              key={pdf.id}
                              variant={selectedPdf?.id === pdf.id ? "secondary" : "ghost"}
                              className="w-full justify-start h-10 text-left group"
                              onClick={() => handlePdfSelect(pdf)}
                              aria-pressed={selectedPdf?.id === pdf.id}
                              aria-describedby={`pdf-${pdf.id}-description`}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={`p-1.5 rounded-md ${
                                  selectedPdf?.id === pdf.id 
                                    ? 'bg-blue-100 dark:bg-blue-900/30' 
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                  <FileText className={`h-4 w-4 ${
                                    selectedPdf?.id === pdf.id 
                                      ? 'text-blue-600' 
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {pdf.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    PDF Document
                                  </div>
                                </div>
                                {selectedPdf?.id === pdf.id && (
                                  <Eye className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assessments Section */}
                    {quizFiles.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <GraduationCap className="h-4 w-4 text-green-600" />
                              Assessments
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {quizFiles.length}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {quizFiles.map((quiz) => (
                              <Button
                                key={quiz.id}
                                variant="ghost"
                                className="w-full justify-start h-10 text-left group"
                                onClick={() => handleStartQuiz(quiz)}
                                aria-describedby={`quiz-${quiz.id}-description`}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="p-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                                    <GraduationCap className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {quiz.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {quiz.questionsCount} questions
                                    </div>
                                  </div>
                                  <PlayCircle className="h-4 w-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Submodules Section */}
                    {subModules.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                              <Users className="h-4 w-4 text-purple-600" />
                              Submodules
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {subModules.length}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {subModules.map((sm) => (
                              <Button
                                key={sm.id}
                                variant="ghost"
                                className="w-full justify-start h-10 text-left group"
                                onClick={() => router.push(`/practice/modules/${moduleId}/${sm.id}`)}
                                aria-describedby={`submodule-${sm.id}-description`}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-900/30">
                                    <BookOpen className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">
                                      {sm.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {sm.description}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </aside>

              {/* Enhanced PDF Viewer */}
              <div className="lg:col-span-3">
                {selectedPdf ? (
                  <Card className="h-[calc(100vh-12rem)]">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-md">{selectedPdf.name}</CardTitle>
                            {/* <CardDescription>PDF Document</CardDescription> */}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size='sm' onClick={handleFullscreen}>
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[calc(100%-5rem)]">
                      <PdfViewer file={selectedPdf} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-[calc(100vh-12rem)] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                      <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {pdfFiles.length === 0 ? 'No Learning Materials' : 'Select a Document'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {pdfFiles.length === 0 
                          ? 'You can explore the submodules to find more information.' 
                          : 'Choose a PDF document from the sidebar to start learning.'
                        }
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}