'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { moduleApi, SubModule, type ModuleTreeNode } from '@/lib/moduleApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronRight, 
  ChevronDown, 
  FolderTree, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Search, 
  Layers,
  Play,
  Download,
  Eye,
  Folder,
  FolderOpen
} from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  path: string; // full path using parent/child ids
  children?: TreeNode[];
  isExpanded?: boolean;
  hasChildren?: boolean; // true if subs exist
}

export default function ModuleTree() {
  const router = useRouter();
  const [roots, setRoots] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [details, setDetails] = useState<{ name: string; description: string; pdfs: number; quizzes: number, subModules: SubModule[] } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const tree = await moduleApi.getModuleTree();
        const toNodes = (nodes: ModuleTreeNode[], parentPath = ''): TreeNode[] =>
          nodes.map((n) => {
            const path = parentPath ? `${parentPath}/${n.id}` : n.id;
            return {
              id: n.id,
              name: n.name,
              path,
              isExpanded: false,
              hasChildren: Array.isArray(n.subModules) && n.subModules.length > 0,
              children: n.subModules ? toNodes(n.subModules, path) : [],
            };
          });
        setRoots(toNodes(tree));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleNode = (targetPath: string) => {
    const updateNode = (node: TreeNode): TreeNode => {
      if (node.path === targetPath) {
        return { ...node, isExpanded: !node.isExpanded };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode)
        };
      }
      return node;
    };
    
    setRoots((prev) => prev.map(updateNode));
  };

  const onNavigate = (path: string) => {
    // Encode each segment safely
    const encoded = path
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
    router.push(`/modules/${encoded}`);
  };

  const getBreadcrumbPath = (path: string) => {
    const segments = path.split('/');
    return segments.map((segment, index) => {
      const segmentPath = segments.slice(0, index + 1).join('/');
      return {
        name: segment,
        path: segmentPath,
        isLast: index === segments.length - 1
      };
    });
  };

  const onSelect = async (path: string) => {
    setSelectedPath(path);
    setDetailsLoading(true);
    try {
      const res = await moduleApi.getModule(path);
      const files = res.data.files || [];
      const pdfs = files.filter((f) => f.type === 'pdf').length;
      const quizzes = files.filter((f) => f.type === 'quiz').length;
      setDetails({ name: res.data.module.name, description: res.data.module.description, pdfs, quizzes,subModules: res.data.subModules });
      toggleNode(path);
    } catch {
      setDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filterTree = (nodes: TreeNode[], q: string): TreeNode[] => {
    if (!q.trim()) return nodes;
    const lower = q.toLowerCase();
    const recurse = (node: TreeNode): TreeNode | null => {
      const childResults = (node.children || []).map(recurse).filter(Boolean) as TreeNode[];
      const isMatch = node.name.toLowerCase().includes(lower);
      if (isMatch || childResults.length) {
        return { ...node, isExpanded: childResults.length > 0 ? true : node.isExpanded, children: childResults };
      }
      return null;
    };
    return nodes.map(recurse).filter(Boolean) as TreeNode[];
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const paddingLeft = 8 + depth * 20;
    const isSelected = selectedPath === node.path;
    
    return (
      <div key={node.path} className="group">
        <div 
          className={`flex items-center py-2 px-2 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
            isSelected ? 'bg-primary/10 border border-primary/20 shadow-sm' : ''
          }`} 
          style={{ paddingLeft }}
        >
          {/* Expand/Collapse Button */}
          <div className="w-6 flex justify-center">
            {node.hasChildren ? (
              <button
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                onClick={() => toggleNode(node.path)}
                aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
              >
                {node.isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Module Icon */}
          <div className="mr-3">
            {node.hasChildren ? (
              node.isExpanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-600" />
              )
            ) : (
              <BookOpen className="h-4 w-4 text-green-600" />
            )}
          </div>

          {/* Module Name */}
          <button
            className={`flex-1 text-left px-2 py-1 rounded transition-colors ${
              isSelected 
                ? 'text-primary font-medium' 
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={() => onSelect(node.path)}
            aria-current={isSelected ? 'true' : 'false'}
          >
            <span className="text-sm truncate block" title={node.name}>
              {node.name}
            </span>
          </button>

          {/* Quick Action Buttons (visible on hover or selection) */}
          <div className={`flex items-center gap-1 transition-opacity ${
            isSelected || 'group-hover:opacity-100 opacity-0'
          }`}>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(node.path);
              }}
              title="Open Module"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {node.isExpanded && node.children && node.children.length > 0 && (
          <div className="ml-2 border-l border-gray-200 dark:border-gray-700">
            {node.children.map((c) => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <CardHeader className="py-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 mb-1">
              <FolderTree className="h-5 w-5 text-primary" />
              Browse Learning Modules
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore course materials, PDFs, and quizzes organized by topic
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search modules, topics, or content..."
              className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 border rounded-lg p-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 border rounded-lg p-6 bg-gray-50/50 dark:bg-gray-800/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        ) : roots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FolderTree className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Modules Available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              There are no learning modules available at the moment. Check back later or contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 border rounded-lg p-4 max-h-[70vh] overflow-auto" role="tree" aria-label="Modules">
              <div className="space-y-1">
                {(filterTree(roots, query)).map((n) => renderNode(n))}
              </div>
            </div>
            <div className="border rounded-lg p-6 min-h-[60vh] bg-gray-50/50 dark:bg-gray-800/20" role="region" aria-label="Module details">
              {!selectedPath ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select a Module
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                      Choose a module from the tree to view its contents, including PDFs, quizzes, and other learning materials.
                    </p>
                  </div>
                </div>
              ) : detailsLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : details ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                          {details.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Learning Module
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Knowledge Base
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {details.pdfs}
                      </div>
                      <div className="text-xs text-gray-500">
                        PDF{details.pdfs !== 1 ? 's' : ''} available
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Assessments
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {details.quizzes}
                      </div>
                      <div className="text-xs text-gray-500">
                        Quiz{details.quizzes !== 1 ? 'zes' : ''} available
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {details.description && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {details.description}
                      </p>
                    </div>
                  )}

                  {/* SubModules */}
                  {details.subModules && details.subModules.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sub-Modules ({details.subModules.length})
                      </h4>
                      <div className="space-y-3">
                        {details.subModules.map((subModule) => {
                          const subModulePdfs = subModule.files?.filter(f => f.type === 'pdf').length || 0;
                          const subModuleQuizzes = subModule.files?.filter(f => f.type === 'quiz').length || 0;
                          const subModuleSubModules = subModule.subModules?.length || 0;
                          return (
                            <div key={subModule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                    {subModule.name}
                                  </h5>
                                  {subModule.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                      {subModule.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      <span>{subModulePdfs} PDF{subModulePdfs !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <HelpCircle className="h-3 w-3" />
                                      <span>{subModuleQuizzes} Quiz{subModuleQuizzes !== 1 ? 'zes' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Folder className="h-3 w-3" />
                                      <span>{subModuleSubModules} Sub-Module{subModuleSubModules !== 1 ? 's' : ''}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => onNavigate(`${selectedPath}/${subModule.id}`)}
                                  title="Open Sub-Module"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Breadcrumb Navigation */}
                  {selectedPath && selectedPath.includes('/') && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Navigation Path
                      </h4>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-500">Root</span>
                        {getBreadcrumbPath(selectedPath).map((breadcrumb, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span className="text-gray-400">/</span>
                            <button
                              onClick={() => onNavigate(breadcrumb.path)}
                              className={`hover:text-primary transition-colors ${
                                breadcrumb.isLast 
                                  ? 'text-primary font-medium' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              {breadcrumb.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button 
                      onClick={() => onNavigate(selectedPath!)}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Start Learning
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => onNavigate(selectedPath!)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Contents
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
                      Failed to Load
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Unable to load module details. Please try again.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}

