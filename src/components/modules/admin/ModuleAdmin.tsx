'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Upload, FileText, GraduationCap, Trash2, Edit, FolderPlus, Folder, ChevronRight, Home } from 'lucide-react';
import { moduleApi, type Module, type SubModule, type ModuleFile, type ModuleResponse } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';

export default function ModuleAdmin() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Current folder state
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentFiles, setCurrentFiles] = useState<ModuleFile[]>([]);
  const [currentSubModules, setCurrentSubModules] = useState<SubModule[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{name: string, path: string}>>([]);

  // Create Module Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');

  // Upload File Dialog State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'quiz'>('pdf');
  const [uploadFileName, setUploadFileName] = useState('');

  useEffect(() => {
    loadCurrentFolder();
  }, []);

  const loadCurrentFolder = async (path?: string) => {
    try {
      setLoading(true);
      const response = await moduleApi.getModule(path);
      
      setCurrentPath(path || '');
      setCurrentModule(response.data.module);
      setCurrentFiles(response.data.files || []);
      setCurrentSubModules(response.data.subModules || []);
      
      // Build breadcrumbs
      if (!path || path === '') {
        setBreadcrumbs([{ name: 'Root', path: '' }]);
      } else {
        const pathParts = path.split('/');
        const breadcrumbParts = [];
        let currentPathPart = '';
        
        for (let i = 0; i < pathParts.length; i++) {
          currentPathPart = i === 0 ? pathParts[i] : `${currentPathPart}/${pathParts[i]}`;
          breadcrumbParts.push({
            name: pathParts[i],
            path: currentPathPart
          });
        }
        
        setBreadcrumbs([{ name: 'Root', path: '' }, ...breadcrumbParts]);
      }
    } catch (error) {
      toast({
        title: "Error loading folder",
        description: error instanceof Error ? error.message : "Failed to load folder contents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    if (!newModuleName.trim()) {
      toast({
        title: "Validation Error",
        description: "Module name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await moduleApi.createModule({
        name: newModuleName,
        description: newModuleDescription,
        parent: currentPath || undefined
      });

      toast({
        title: "Success",
        description: `Module "${newModuleName}" created successfully`,
      });

      setCreateDialogOpen(false);
      setNewModuleName('');
      setNewModuleDescription('');
      
      // Reload current folder to show the new module
      loadCurrentFolder(currentPath);
    } catch (error) {
      toast({
        title: "Error creating module",
        description: error instanceof Error ? error.message : "Failed to create module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadFileName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await moduleApi.createModuleFile(
        currentPath,
        uploadFile,
        uploadFileType,
        uploadFileName
      );

      toast({
        title: "Success",
        description: `File "${uploadFileName}" uploaded successfully`,
      });

      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadFileName('');
      setUploadFileType('pdf');

      // Reload current folder to show the new file
      loadCurrentFolder(currentPath);
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/practice');
  };

  const navigateToFolder = (path: string) => {
    loadCurrentFolder(path);
  };

  const navigateToSubModule = (subModule: SubModule) => {
    const newPath = currentPath ? `${currentPath}/${subModule.id}` : subModule.id;
    loadCurrentFolder(newPath);
  };

  const handleDeleteFile = async (fileId: string, fileName: string) => {
    try {
      setLoading(true);
      await moduleApi.deleteFile(currentPath, fileId);

      toast({
        title: "Success",
        description: `File "${fileName}" deleted successfully`,
      });

      // Reload current folder to reflect the deletion
      loadCurrentFolder(currentPath);
    } catch (error) {
      toast({
        title: "Error deleting file",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleName: string) => {
    try {
      setLoading(true);
      await moduleApi.deleteModule(moduleId);

      toast({
        title: "Success",
        description: `Module "${moduleName}" deleted successfully`,
      });

      // Navigate back to parent folder or root
      const pathParts = currentPath.split('/');
      pathParts.pop(); // Remove the deleted module from path
      const parentPath = pathParts.join('/');
      
      loadCurrentFolder(parentPath);
    } catch (error) {
      toast({
        title: "Error deleting module",
        description: error instanceof Error ? error.message : "Failed to delete module",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Module Administration
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create and manage learning modules, upload materials and quizzes
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />}
                <button
                  onClick={() => navigateToFolder(crumb.path)}
                  className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    index === breadcrumbs.length - 1 
                      ? 'text-gray-900 dark:text-white font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {index === 0 && <Home className="h-4 w-4" />}
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Current Folder Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  {currentModule?.name || 'Root Folder'}
                </CardTitle>
                <CardDescription>
                  {currentModule?.description || 'Manage modules and files in this folder'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Create Submodule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Submodule</DialogTitle>
                      <DialogDescription>
                        Add a new submodule to {currentModule?.name || 'this folder'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="module-name">Module Name *</Label>
                        <Input
                          id="module-name"
                          value={newModuleName}
                          onChange={(e) => setNewModuleName(e.target.value)}
                          placeholder="e.g., Chapter 1 - Introduction"
                        />
                      </div>
                      <div>
                        <Label htmlFor="module-description">Description</Label>
                        <Textarea
                          id="module-description"
                          value={newModuleDescription}
                          onChange={(e) => setNewModuleDescription(e.target.value)}
                          placeholder="Brief description of the module..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateModule} disabled={loading}>
                        {loading ? "Creating..." : "Create Module"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() => setUploadDialogOpen(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                {currentPath && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${currentModule?.name}"? This action cannot be undone.`)) {
                        handleDeleteModule(currentPath, currentModule?.name || 'this module');
                      }
                    }}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Module
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Submodules */}
                {currentSubModules.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      Submodules ({currentSubModules.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSubModules.map((subModule) => (
                        <div
                          key={subModule.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                        >
                          <div className="flex items-center justify-between">
                            <div 
                              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                              onClick={() => navigateToSubModule(subModule)}
                            >
                              <Folder className="h-8 w-8 text-blue-500 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{subModule.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                  {subModule.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {(subModule as any).files?.filter((f: any) => f.type === 'pdf').length || 0} PDFs
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" />
                                    {(subModule as any).files?.filter((f: any) => f.type === 'quiz').length || 0} Quizzes
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Folder className="h-3 w-3" />
                                    {(subModule as any).subModules?.length || 0} Submodules
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Are you sure you want to delete "${subModule.name}"? This action cannot be undone.`)) {
                                    const modulePath = currentPath ? `${currentPath}/${subModule.id}` : subModule.id;
                                    handleDeleteModule(modulePath, subModule.name);
                                  }
                                }}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files */}
                {currentFiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Files ({currentFiles.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentFiles.map((file) => (
                        <div
                          key={file.id}
                          className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {file.type === 'pdf' ? (
                                <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                              ) : (
                                <GraduationCap className="h-8 w-8 text-green-500 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-medium truncate">{file.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {file.type === 'pdf' ? 'PDF Document' : 'Quiz'}
                                  {file.questionsCount && ` • ${file.questionsCount} questions`}
                                </p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file.id, file.name);
                              }}
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {currentSubModules.length === 0 && currentFiles.length === 0 && (
                  <div className="text-center py-12">
                    <FolderPlus className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Empty Folder
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This folder is empty. Create a submodule or upload a file to get started.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <FolderPlus className="h-4 w-4 mr-2" />
                            Create Submodule
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload File Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload a PDF document or quiz file (CSV/XLSX) to {currentModule?.name || 'this folder'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-name">File Name *</Label>
                <Input
                  id="file-name"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g., Chapter 1 - Introduction"
                />
              </div>
              <div>
                <Label htmlFor="file-type">File Type *</Label>
                <select
                  id="file-type"
                  value={uploadFileType}
                  onChange={(e) => setUploadFileType(e.target.value as 'pdf' | 'quiz')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="quiz">Quiz (CSV/XLSX)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="file-upload">Select File *</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept={uploadFileType === 'pdf' ? '.pdf' : '.csv,.xlsx,.xls'}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}