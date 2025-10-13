// Module API Service
import { mockModules, mockFiles, mockQuizQuestions, mockNestedModules } from './mockModuleData';
import { authService } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}` : 'http://127.0.0.1:5003/SalesHQ-9f49f/asia-south1/dashboardApi';
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
  files?: ModuleFile[];
  subModules?: SubModule[];
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

// Tree node preserving nested submodules
export interface ModuleTreeNode {
  id: string;
  name: string;
  description: string;
  subModules?: ModuleTreeNode[];
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

export interface SaveQuizAnswersResponse {
  data: {
    success: boolean;
    score: number;
    correct: number;
    wrong: number;
    notAttempted: number;
  };
}

export interface UserQuizResponseItem {
  score: number;
  correct: number;
  wrong: number;
  notAttempted: number;
  title: string;
  takenAt?: number;
}

export interface GetUserQuizResponsesResponse {
  data: UserQuizResponseItem[];
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalQuestions: number;
  totalCorrect: number;
  averageScore: number;
  quizCount: number;
  rank: number;
}

export interface GetLeaderboardResponse {
  data: {
    success: boolean;
    data: LeaderboardEntry[];
  };
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

  async getModule(path?: string): Promise<ModuleResponse> {

    const url = path ? `${API_BASE_URL}/getModule?path=${path}` : `${API_BASE_URL}/getModule`;
    const response = await authService.authenticatedFetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch module');
    }

    const json = await response.json();

    // Handle root modules (array response) vs specific module (single object)
    if (Array.isArray(json?.data)) {
      // Root modules response wrapped in data property
      const rootModules = json.data.map((entry: any) => {
        const files = (entry?.files ?? []).map((f: any) => ({
          id: f?.id,
          name: f?.name ?? f?.title ?? 'Untitled',
          type: f?.type,
          location: f?.location,
          createdAt: f?.createdAt,
          createdBy: f?.createdBy,
          questionsCount: f?.questionsCount,
          url: f?.url,
        })) as ModuleFile[];

        const subModules = (entry?.subModules ?? []).map((m: any) => ({
          id: m?.id ?? m?.name,
          name: m?.name ?? '',
          description: m?.description ?? '',
          subModules: m?.subModules ?? [],
          files: m?.files ?? [],
        })) as SubModule[];

        return {
          id: entry?.module?.id ?? entry?.module?.name ?? String(Math.random()),
          name: entry?.module?.name ?? '',
          description: entry?.module?.description ?? '',
          files: files,
          subModules: subModules,
        };
      });

      return {
        data: {
          module: { id: 'root', name: 'Root', description: 'Root module' },
          files: [],
          subModules: rootModules,
        },
      };
    }

    if (Array.isArray(json)) {
      // Root modules response - return first module as current, others as submodules
      const rootModules = json.map((entry: any) => {
        const files = (entry?.files ?? []).map((f: any) => ({
          id: f?.id,
          name: f?.name ?? f?.title ?? 'Untitled',
          type: f?.type,
          location: f?.location,
          createdAt: f?.createdAt,
          createdBy: f?.createdBy,
          questionsCount: f?.questionsCount,
          url: f?.url,
        })) as ModuleFile[];

        const subModules = (entry?.subModules ?? []).map((m: any) => ({
          id: m?.id ?? m?.name,
          name: m?.name ?? '',
          description: m?.description ?? '',
        })) as SubModule[];

        return {
          id: entry?.module?.id ?? entry?.module?.name ?? String(Math.random()),
          name: entry?.module?.name ?? '',
          description: entry?.module?.description ?? '',
          files: files,
          subModules: subModules,
        };
      });

      return {
        data: {
          module: { id: 'root', name: 'Root', description: 'Root module' },
          files: [],
          subModules: rootModules,
        },
      };
    }

    // Single module response
    const payload = json?.data ? json.data : json;

    const normModule: Module = {
      id: payload?.module?.id ?? payload?.module?.name ?? (path || 'root'),
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
      ? payload.subModules.map((m: any) => {
          const files = (m?.files ?? []).map((f: any) => ({
            id: f?.id,
            name: f?.name ?? f?.title ?? 'Untitled',
            type: f?.type,
            location: f?.location,
            createdAt: f?.createdAt,
            createdBy: f?.createdBy,
            questionsCount: f?.questionsCount,
            url: f?.url,
          })) as ModuleFile[];

          const subModules = (m?.subModules ?? []).map((sm: any) => ({
            id: sm?.id ?? sm?.name,
            name: sm?.name ?? '',
            description: sm?.description ?? '',
          })) as SubModule[];

          return {
            id: m?.id ?? m?.name,
            name: m?.name ?? '',
            description: m?.description ?? '',
            files: files,
            subModules: subModules,
          };
        })
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
        subModules: mockNestedModules[m.id as keyof typeof mockNestedModules] || [],
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

  // Returns full nested tree of modules (no flattening)
  async getModuleTree(): Promise<ModuleTreeNode[]> {
    // Use mock data if enabled
    if (USE_MOCK_DATA) {
      // Build a simple nested mock tree from mockModules and mockFiles structure
      const toTree = (mods: typeof mockModules): ModuleTreeNode[] =>
        mods.map((m) => ({ id: m.id, name: m.name, description: m.description, subModules: [] }));
      return toTree(mockModules);
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getModule`);
    if (!response.ok) {
      throw new Error('Failed to fetch module tree');
    }
    const json = await response.json();

    const normalizeTree = (e: any): ModuleTreeNode => {
      const m = e?.module ?? e;
      const children = e?.subModules ?? m?.subModules ?? [];
      return {
        id: m?.id ?? m?.name ?? String(Math.random()),
        name: m?.name ?? '',
        description: m?.description ?? '',
        subModules: Array.isArray(children) ? children.map((c: any) => normalizeTree(c)) : [],
      };
    };

    if (Array.isArray(json)) {
      return json.map((e: any) => normalizeTree(e));
    }
    if (Array.isArray(json?.data)) {
      return json.data.map((e: any) => normalizeTree(e));
    }
    if (Array.isArray(json?.data?.subModules)) {
      return json.data.subModules.map((e: any) => normalizeTree(e));
    }
    if (json?.data?.module) {
      return [normalizeTree(json.data)];
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

  async saveModuleQuizAnswers(id: string, answers: Record<string, string>): Promise<SaveQuizAnswersResponse> {
    // Use mock implementation if enabled
    if (USE_MOCK_DATA) {
      const questions = mockQuizQuestions[id as keyof typeof mockQuizQuestions] || [];
      let correct = 0;
      let wrong = 0;
      let notAttempted = 0;

      const questionById: Record<string, QuizQuestion> = {} as any;
      questions.forEach((q) => {
        questionById[q.id] = q;
      });

      questions.forEach((q) => {
        const selected = answers[q.id];
        if (!selected) {
          notAttempted += 1;
        } else if (selected === q.answer) {
          correct += 1;
        } else {
          wrong += 1;
        }
      });

      return {
        data: {
          success: true,
          score: correct,
          correct,
          wrong,
          notAttempted,
        },
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/saveModuleQuizAnswers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to save quiz answers');
    }

    return response.json();
  }

  async getUserQuizResponses(): Promise<GetUserQuizResponsesResponse> {
    if (USE_MOCK_DATA) {
      return {
        data: [
          { score: 92, correct: 23, wrong: 2, notAttempted: 0, title: 'Sales Fundamentals', takenAt: Date.now() - 86400000 },
          { score: 76, correct: 19, wrong: 6, notAttempted: 0, title: 'Product Training 101 - Assessment', takenAt: Date.now() - 3 * 86400000 },
          { score: 58, correct: 14, wrong: 11, notAttempted: 0, title: 'Support Playbook Basics', takenAt: Date.now() - 7 * 86400000 },
        ],
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/getUserQuizResponses`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to load user quiz responses');
    }

    return response.json();
  }

  async getLeaderboard(quizId?: string): Promise<GetLeaderboardResponse> {
    if (USE_MOCK_DATA) {
      return {
        data: {
          success: true,
          data: [
            { userId: '1', userName: 'Alice Johnson', totalQuestions: 120, totalCorrect: 100, averageScore: 83, quizCount: 6, rank: 1 },
            { userId: '2', userName: 'Brian Lee', totalQuestions: 95, totalCorrect: 74, averageScore: 78, quizCount: 5, rank: 2 },
            { userId: '3', userName: 'Carol Singh', totalQuestions: 60, totalCorrect: 42, averageScore: 70, quizCount: 3, rank: 3 },
            { userId: '4', userName: 'You', totalQuestions: 40, totalCorrect: 28, averageScore: 68, quizCount: 2, rank: 4 },
          ],
        },
      };
    }

    const url = quizId ? `${API_BASE_URL}/getLeaderboard?id=${quizId}` : `${API_BASE_URL}/getLeaderboard`;
    const response = await authService.authenticatedFetch(url, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to load leaderboard');
    }
    return response.json();
  }

  async deleteFile(moduleId: string, fileId: string): Promise<{ message: string }> {
    // Use mock implementation if enabled
    if (USE_MOCK_DATA) {
      // Remove file from localStorage
      if (typeof window !== 'undefined') {
        const storedFiles = localStorage.getItem('mockModuleFiles');
        if (storedFiles) {
          const files = JSON.parse(storedFiles);
          if (files[moduleId]) {
            files[moduleId] = files[moduleId].filter((file: ModuleFile) => file.id !== fileId);
            localStorage.setItem('mockModuleFiles', JSON.stringify(files));
          }
        }
      }
      
      return {
        message: 'File deleted successfully'
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/deleteFile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moduleId, fileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete file');
    }

    return response.json();
  }

  async deleteModule(id: string): Promise<{ message: string }> {
    // Use mock implementation if enabled
    if (USE_MOCK_DATA) {
      // Remove module from localStorage
      if (typeof window !== 'undefined') {
        const storedModules = localStorage.getItem('mockModules');
        if (storedModules) {
          const modules = JSON.parse(storedModules);
          const filteredModules = modules.filter((module: Module) => module.id !== id);
          localStorage.setItem('mockModules', JSON.stringify(filteredModules));
        }
      }
      
      return {
        message: 'Module deleted successfully'
      };
    }

    const response = await authService.authenticatedFetch(`${API_BASE_URL}/deleteModule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete module');
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