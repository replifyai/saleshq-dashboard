// Module API Service
import { mockModules, mockFiles, mockQuizQuestions } from './mockModuleData';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}` : 'http://127.0.0.1:5003/replify-9f49f/asia-south1/dashboardApi';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false; // Default to mock data for testing

export interface Module {
  id: string;
  name: string;
  description: string;
  parent?: string;
}

export interface ModuleFile {
  id: string;
  name: string;
  type: 'pdf' | 'quiz';
  location?: string;
  createdAt?: number;
  createdBy?: string;
  questionsCount?: number;
  url?: string;
}

export interface SubModule {
  id: string;
  name: string;
  description: string;
}

export interface ModuleResponse {
  data: {
    module: Module;
    files: ModuleFile[];
    subModules: SubModule[];
  };
}

export interface RootModuleEntry {
  module: Module;
  files: ModuleFile[];
  subModules: SubModule[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  order: number;
  createdAt: number;
}

export interface QuizResponse {
  data: {
    success: boolean;
    data: {
      quiz: {
        id: string;
        type: string;
        title: string;
        description: string;
        createdAt: number;
        createdBy: string;
        location: string;
        questionsCount: number;
      };
      questions: QuizQuestion[];
    };
  };
}

export interface CreateModuleRequest {
  name: string;
  description: string;
  parent?: string;
}

export interface CreateModuleResponse {
  message: string;
  moduleId: string;
}

export interface CreateModuleFileResponse {
  message: string;
  fileId: string;
}

class ModuleApi {

  async createModule(data: CreateModuleRequest): Promise<CreateModuleResponse> {
    // Use mock implementation if enabled
    if (USE_MOCK_DATA) {
      const newModule = {
        id: `module-${Date.now()}`,
        name: data.name,
        description: data.description
      };
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        const storedModules = localStorage.getItem('mockModules');
        const modules = storedModules ? JSON.parse(storedModules) : [...mockModules];
        modules.push(newModule);
        localStorage.setItem('mockModules', JSON.stringify(modules));
      }
      
      return {
        message: 'Module created successfully',
        moduleId: newModule.id
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/createModule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create module');
    }

    return response.json();
  }

  async getModule(path: string): Promise<ModuleResponse> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      // Get modules from localStorage or use default
      let allModules = [...mockModules];
      if (typeof window !== 'undefined') {
        const storedModules = localStorage.getItem('mockModules');
        if (storedModules) {
          allModules = JSON.parse(storedModules);
        }
      }
      
      const module = allModules.find(m => m.id === path) || allModules[0];
      
      // Get files from localStorage or use default
      let files = mockFiles[path as keyof typeof mockFiles] || [];
      if (typeof window !== 'undefined') {
        const storedFiles = localStorage.getItem('mockModuleFiles');
        if (storedFiles) {
          const allFiles = JSON.parse(storedFiles);
          if (allFiles[path]) {
            files = allFiles[path];
          }
        }
      }
      
      return {
        data: {
          module: module,
          files: files,
          subModules: []
        }
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getModule?path=${path}`);

    if (!response.ok) {
      throw new Error('Failed to fetch module');
    }

    const json = await response.json();

    // Normalize array, {data:{...}}, or flat {...}
    let payload = json?.data ? json.data : json;
    if (Array.isArray(json)) {
      payload = json[0] ?? {};
    }

    const normModule: Module = {
      id: payload?.module?.id ?? payload?.module?.name ?? path,
      name: payload?.module?.name ?? '',
      description: payload?.module?.description ?? '',
      parent: payload?.module?.parent,
    };

    const normFiles: ModuleFile[] = Array.isArray(payload?.files)
      ? payload.files.map((f: any) => ({
          id: f?.id,
          name: f?.name ?? f?.title ?? 'Untitled',
          type: f?.type,
          location: f?.location,
          createdAt: f?.createdAt,
          createdBy: f?.createdBy,
          questionsCount: f?.questionsCount,
          url: f?.url,
        }))
      : [];

    const normSubs: SubModule[] = Array.isArray(payload?.subModules)
      ? payload.subModules.map((m: any) => ({
          id: m?.id ?? m?.name,
          name: m?.name ?? '',
          description: m?.description ?? '',
        }))
      : [];

    return {
      data: {
        module: normModule,
        files: normFiles,
        subModules: normSubs,
      },
    };
  }

  async getRootModules(): Promise<ModuleResponse> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      // Get modules from localStorage or use default mock data
      let modules = [...mockModules];
      if (typeof window !== 'undefined') {
        const storedModules = localStorage.getItem('mockModules');
        if (storedModules) {
          modules = JSON.parse(storedModules);
        }
      }
      
      return {
        data: {
          module: {
            id: 'root',
            name: 'Root',
            description: 'Root module'
          },
          files: [],
          subModules: modules
        }
      };
    }

    // Fetch root modules (no parent)
    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getModule`);

    if (!response.ok) {
      throw new Error('Failed to fetch modules');
    }

    const json = await response.json();
    // Some backends return an array under data for root modules
    // Transform into our expected shape
    if (Array.isArray(json?.data)) {
      const subModules: SubModule[] = json.data.map((entry: any) => {
        const mod = entry?.module ?? entry;
        return {
          id: mod?.id ?? mod?.name ?? String(Math.random()),
          name: mod?.name ?? '',
          description: mod?.description ?? '',
        } as SubModule;
      });

      return {
        data: {
          module: { id: 'root', name: 'Root', description: 'Root module' },
          files: [],
          subModules,
        },
      };
    }

    // If already in expected shape, pass through
    if (json?.data?.subModules) {
      return json as ModuleResponse;
    }

    // Fallback: try to coerce a single module into subModules
    if (json?.data?.module) {
      const mod = json.data.module;
      return {
        data: {
          module: { id: 'root', name: 'Root', description: 'Root module' },
          files: [],
          subModules: [{ id: mod.id, name: mod.name, description: mod.description }],
        },
      };
    }

    return {
      data: {
        module: { id: 'root', name: 'Root', description: 'Root module' },
        files: [],
        subModules: [],
      },
    };
  }

  async getRootModulesEntries(): Promise<RootModuleEntry[]> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      // Build entries from mock modules and mock files structure if available
      const entries: RootModuleEntry[] = mockModules.map((m) => ({
        module: { id: m.id, name: m.name, description: m.description },
        files: mockFiles[m.id as keyof typeof mockFiles] || [],
        subModules: [],
      }));
      return entries;
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getModule`);
    if (!response.ok) {
      throw new Error('Failed to fetch modules');
    }
    const json = await response.json();

    // API can return an array at top-level or under data
    const normalizeEntry = (e: any): RootModuleEntry => {
      const mod = e?.module ?? e;
      const files = (e?.files ?? []).map((f: any) => ({
        id: f?.id,
        name: f?.name ?? f?.title ?? 'Untitled',
        type: f?.type,
        location: f?.location,
        createdAt: f?.createdAt,
        createdBy: f?.createdBy,
        questionsCount: f?.questionsCount,
        url: f?.url,
      })) as ModuleFile[];
      const subs = (e?.subModules ?? []).map((m: any) => ({
        id: m?.id ?? m?.name,
        name: m?.name ?? '',
        description: m?.description ?? '',
      })) as SubModule[];
      return {
        module: {
          id: mod?.id ?? mod?.name ?? String(Math.random()),
          name: mod?.name ?? '',
          description: mod?.description ?? '',
        },
        files,
        subModules: subs,
      };
    };

    if (Array.isArray(json)) {
      return (json as any[]).map(normalizeEntry);
    }
    if (Array.isArray(json?.data)) {
      return (json.data as any[]).map(normalizeEntry);
    }
    // If single object with subModules, coerce into one entry
    if (json?.data?.module) {
      const d = json.data;
      return [
        {
          module: d.module as Module,
          files: (d.files || []) as ModuleFile[],
          subModules: (d.subModules || []) as SubModule[],
        },
      ];
    }
    return [];
  }

  async createModuleFile(
    moduleId: string,
    file: File,
    type: 'pdf' | 'quiz',
    name: string
  ): Promise<CreateModuleFileResponse> {
    // Use mock implementation if enabled
    if (USE_MOCK_DATA) {
      const fileId = `file-${Date.now()}`;
      const newFile = {
        id: fileId,
        name: name,
        type: type,
        location: `mock/${file.name}`,
        createdAt: Date.now(),
        questionsCount: type === 'quiz' ? Math.floor(Math.random() * 20) + 10 : undefined
      };
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        const storedFiles = localStorage.getItem('mockModuleFiles');
        const files = storedFiles ? JSON.parse(storedFiles) : {};
        if (!files[moduleId]) {
          files[moduleId] = [];
        }
        files[moduleId].push(newFile);
        localStorage.setItem('mockModuleFiles', JSON.stringify(files));
      }
      
      return {
        message: 'File created successfully',
        fileId: fileId
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', moduleId);
    formData.append('type', type);
    formData.append('name', name);

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/createModuleFile`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }

  async getModuleQuiz(path: string): Promise<QuizResponse> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      // Extract quiz ID from path (format: moduleId/quizId)
      const parts = path.split('/');
      const quizId = parts[parts.length - 1];
      const questions = mockQuizQuestions[quizId as keyof typeof mockQuizQuestions] || mockQuizQuestions['quiz-1'];
      
      return {
        data: {
          success: true,
          data: {
            quiz: {
              id: quizId,
              type: 'quiz',
              title: 'Sample Quiz',
              description: 'A sample quiz for testing',
              createdAt: Date.now(),
              createdBy: 'system',
              location: 'mock',
              questionsCount: questions.length
            },
            questions: questions
          }
        }
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getModuleQuiz?path=${path}`);

    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    return response.json();
  }

  async getPdfUrl(location: string): Promise<string> {
    // For mock data, return a sample PDF URL
    if (USE_MOCK_DATA) {
      // You can replace this with an actual sample PDF URL
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
    // If already an absolute URL, return as-is
    if (location.startsWith('http://') || location.startsWith('https://')) {
      return location;
    }
    
    // This would typically return a signed URL or direct URL to the PDF
    // The actual PDF fetching should use authenticated requests if needed
    // For now, we'll assume the location is a relative path that needs to be converted to a full URL
    const token = await authService.getAccessToken();
    if (token) {
      // Return URL with token as query parameter if needed
      return `${API_BASE_URL}/files/${location}?token=${encodeURIComponent(token)}`;
    }
    return `${API_BASE_URL}/files/${location}`;
  }
}

export const moduleApi = new ModuleApi();