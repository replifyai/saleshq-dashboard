'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Upload, FileText, GraduationCap, Trash2, Edit, FolderPlus } from 'lucide-react';
import { moduleApi, type Module, type SubModule, type ModuleFile, type RootModuleEntry } from '@/lib/moduleApi';
import { useToast } from '@/hooks/use-toast';

export default function ModuleAdmin() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<SubModule[]>([]);
  const [rootEntries, setRootEntries] = useState<RootModuleEntry[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedModulePath, setSelectedModulePath] = useState<string>('');
  const [moduleFiles, setModuleFiles] = useState<ModuleFile[]>([]);

  // Create Module Dialog State
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [parentModule, setParentModule] = useState<string>('');

  // Upload File Dialog State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadModuleId, setUploadModuleId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileType, setUploadFileType] = useState<'pdf' | 'quiz'>('pdf');
  const [uploadFileName, setUploadFileName] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const entries = await moduleApi.getRootModulesEntries();
      setRootEntries(entries || []);
      // Preserve existing select options as top-level modules
      setModules((entries || []).map((e) => ({ id: e.module.id, name: e.module.name, description: e.module.description })));
    } catch (error) {
      toast({
        title: "Error fetching modules",
        description: error instanceof Error ? error.message : "Failed to load modules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleDetails = async (moduleId: string) => {
    try {
      const response = await moduleApi.getModule(moduleId);
      setSelectedModule(response.data.module);
      setModuleFiles(response.data.files || []);
      setSelectedModulePath(moduleId);
    } catch (error) {
      toast({
        title: "Error fetching module details",
        description: error instanceof Error ? error.message : "Failed to load module details",
        variant: "destructive"
      });
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
        parent: parentModule || undefined
      });

      toast({
        title: "Success",
        description: `Module "${newModuleName}" created successfully`,
      });

      setCreateDialogOpen(false);
      setNewModuleName('');
      setNewModuleDescription('');
      setParentModule('');
      fetchModules();
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
    if (!uploadFile || !uploadModuleId || !uploadFileName.trim()) {
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
        uploadModuleId,
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

      // Refresh module details if viewing
      if (selectedModule?.id === uploadModuleId) {
        fetchModuleDetails(uploadModuleId);
      }
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

  const [activeTab, setActiveTab] = useState<'modules' | 'files'>('modules');

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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'modules' | 'files')} className="space-y-4">
          <TabsList>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="files">Files & Quizzes</TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Manage Modules</CardTitle>
                    <CardDescription>Create and organize learning modules</CardDescription>
                  </div>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Module
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Module</DialogTitle>
                        <DialogDescription>
                          Add a new learning module to the system
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="module-name">Module Name *</Label>
                          <Input
                            id="module-name"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                            placeholder="e.g., Introduction to AI"
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
                        <div className="space-y-2 col-span-2">
                          <Label>Parent Module *</Label>
                          <Select value={parentModule} onValueChange={setParentModule} disabled={loading}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent module (optional)" />
                            </SelectTrigger>
                            <SelectContent searchable searchPlaceholder="Search products..." noResultsText="No products found">
                              {(modules || []).map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                </div>
              </CardHeader>
              <CardContent>
                {rootEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No modules created yet. Start by creating your first module.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rootEntries.map((entry, idx) => (
                      <div key={`${entry.module.id}-${idx}`} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{entry.module.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {entry.module.description || 'No description provided'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{entry.subModules.length} submodule{entry.subModules.length === 1 ? '' : 's'} · {entry.files.filter(f=>f.type==='pdf').length} PDFs · {entry.files.filter(f=>f.type==='quiz').length} {entry.files.filter(f=>f.type==='quiz').length===1?'quiz':'quizzes'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUploadModuleId(entry.module.id);
                                setUploadDialogOpen(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => { await fetchModuleDetails(entry.module.id); setActiveTab('files'); }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        {entry.subModules.length > 0 && (
                          <div className="mt-3 pl-3 border-l">
                            {entry.subModules.map((sm) => (
                              <div key={sm.id} className="flex items-center justify-between py-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{sm.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{sm.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setUploadModuleId(`${entry.module.id}/${sm.id}`); setUploadDialogOpen(true); }}
                                  >
                                    <Upload className="h-4 w-4 mr-1" />
                                    Upload
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => { await fetchModuleDetails(`${entry.module.id}/${sm.id}`); setActiveTab('files'); }}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Module Files & Quizzes</CardTitle>
                    <CardDescription>
                      {selectedModule
                        ? `Files for: ${selectedModule.name}${selectedModulePath && selectedModulePath.includes('/') ? ` (${selectedModulePath})` : ''}`
                        : 'Select a module or submodule to view its files'}
                    </CardDescription>
                  </div>
                  {selectedModule && (
                    <Button
                      onClick={() => {
                        setUploadModuleId(selectedModulePath || selectedModule.id);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!selectedModule ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Select a module from the Modules tab to view its files
                    </p>
                  </div>
                ) : moduleFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No files uploaded for this module yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {moduleFiles.map((file, idx) => (
                      <div
                        key={`${file.id}-${idx}`}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {file.type === 'pdf' ? (
                            <FileText className="h-8 w-8 text-blue-500" />
                          ) : (
                            <GraduationCap className="h-8 w-8 text-green-500" />
                          )}
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Type: {file.type === 'pdf' ? 'PDF Document' : 'Quiz'}
                              {file.questionsCount && ` • ${file.questionsCount} questions`}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upload File Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
              <DialogDescription>
                Upload a PDF document or quiz file (CSV/XLSX) to the module
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
                <Select value={uploadFileType} onValueChange={(value) => setUploadFileType(value as 'pdf' | 'quiz')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="quiz">Quiz (CSV/XLSX)</SelectItem>
                  </SelectContent>
                </Select>
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