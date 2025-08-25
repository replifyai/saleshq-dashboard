'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { moduleApi, type ModuleTreeNode } from '@/lib/moduleApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ChevronDown, FolderTree, BookOpen, Dot, Search, Layers } from 'lucide-react';

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
  const [details, setDetails] = useState<{ name: string; description: string; pdfs: number; quizzes: number } | null>(null);

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
    setRoots((prev) => prev.map((n) => (n.path === targetPath ? { ...n, isExpanded: !n.isExpanded } : n)));
  };

  const onNavigate = (path: string) => {
    // Encode each segment safely
    const encoded = path
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');
    router.push(`/modules/${encoded}`);
  };

  const onSelect = async (path: string) => {
    setSelectedPath(path);
    setDetailsLoading(true);
    try {
      const res = await moduleApi.getModule(path);
      const files = res.data.files || [];
      const pdfs = files.filter((f) => f.type === 'pdf').length;
      const quizzes = files.filter((f) => f.type === 'quiz').length;
      setDetails({ name: res.data.module.name, description: res.data.module.description, pdfs, quizzes });
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
    const paddingLeft = 8 + depth * 16;
    return (
      <div key={node.path}>
        <div className="flex items-center py-1" style={{ paddingLeft }}>
          {node.hasChildren ? (
            <button
              className="mr-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => toggleNode(node.path)}
              aria-label={node.isExpanded ? 'Collapse' : 'Expand'}
            >
              {node.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : <button className="mr-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" disabled={true}><Dot className="h-4 w-4" /></button>}
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedPath === node.path ? 'bg-primary/10 text-primary' : ''}`}
            onClick={() => onSelect(node.path)}
            aria-current={selectedPath === node.path ? 'true' : 'false'}
          >
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span className="text-sm truncate max-w-[220px]" title={node.name}>{node.name}</span>
          </button>
        </div>
        {node.isExpanded && node.children && node.children.length > 0 && (
          <div>{node.children.map((c) => renderNode(c, depth + 1))}</div>
        )}
        {/* No async loading state since full tree is provided */}
      </div>
    );
  };

  return (
    <div>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
             Browse Modules
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search modules..."
              className="pl-8 h-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="text-sm text-gray-500">Loading module tree...</div>
        ) : roots.length === 0 ? (
          <div className="text-sm text-gray-500">No modules available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1 border rounded-md p-2 max-h-[60vh] overflow-auto" role="tree" aria-label="Modules">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {(filterTree(roots, query)).map((n) => renderNode(n))}
              </div>
            </div>
            <div className="md:col-span-2 border rounded-md p-4 min-h-[60vh]" role="region" aria-label="Module details">
              {!selectedPath ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  Select a module to see details and quick actions
                </div>
              ) : detailsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : details ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <h3 className="text-lg font-semibold">{details.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">PDFs: {details.pdfs}</Badge>
                      <Badge variant="secondary">Quizzes: {details.quizzes}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{details.description || 'No description provided.'}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onNavigate(selectedPath!)}>Open Module</Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-red-500">Failed to load details.</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}

