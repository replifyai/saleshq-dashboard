import { authService } from './auth';
import { getApiUrl } from './api';

// Types for API responses
export interface ChatMessage {
  id: string;
  message: string;
  timestamp: number;
  sender: 'user' | 'bot';
  sources?: Array<{
    documentId: number;
    filename: string;
    content: string;
    score: number;
    metadata: any[];
    sourceUrl: string;
    uploadType: string;
  }>;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  isMoreDataAvailable: boolean;
}

export interface APIResponse {
  message: string;
  timestamp: number;
  sources?: any[];
}

export interface Product {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  files: Array<{
    url: string;
    fileId: string;
    filename: string;
    storagePath: string;
  }>;
  media?: ProductMediaData[]; // New media field
  // Optional fields for backward compatibility
  description?: string;
  price?: string;
  category?: string;
}

// Basic product interface for chat interface
export interface BasicProduct {
  id: string;
  name: string;
}

export interface ProductImage {
  id: string;
  name: string;
  url: string;
  filename: string;
}

export interface ProductImagesResponse {
  productId: string;
  productName: string;
  images: ProductImage[];
}

export interface ProductVideo {
  id: string;
  name: string;
  url: string;
  filename: string;
  duration?: number;
  size?: number;
}

export interface ProductVideosResponse {
  productId: string;
  productName: string;
  videos: ProductVideo[];
}

// Interface for the unified media API response
export interface ProductMediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface ProductMediaData {
  name: string;
  description: string;
  media: ProductMediaItem[];
  id?: string;
}

export interface ProductMediaResponse {
  data: ProductMediaData[];
}

// No caching - direct API calls only

export interface Tag {
  id: string;
  name: string;
  createdAt?: string;
}

export interface UnansweredQuery {
  id: string;
  message: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  context: string;
  status: string;
  priority: string;
  messageRef: string;
  productName: string;
  userName: string;
  tags?: Tag[];
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: string;
  userUsage: string;
  allUsage: any;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export interface FeedbackQuestionsResponse {
  data: UnansweredQuery[];
  totalCount: number;
  page: string;
  pageSize: string;
  totalPages: number;
  hasMore: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  correctAnswer: number;
  explanation: string;
  type: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
  count?: number;
  type?: string;
}

export interface BatchJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  totalItems: number;
  completedItems: number;
  failedItems: number;
  concurrency: number;
  retryAttempts: number;
  startTime: string;
  items: Array<{
    id: string;
    url: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    startTime: string;
    endTime?: string;
    documentId?: number;
    error?: string;
  }>;
}

export interface Document {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  size: number;
  uploadedAt: string;
  processedAt: string | null;
  status: string;
  chunkCount: number;
  metadata?: any;
}

// Chat API calls
export const chatApi = {
  // Get chat history
  getChatHistory: async (pagination?: { timestamp?: number }): Promise<ChatHistoryResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/getChatHistory`;
    const response = await authService.authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagination || {}),
    });

    if (!response.ok) {
      throw new Error(`Failed to load chat history: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      messages: data.messages.map((msg: any) => ({
        ...msg,
        id: `${msg.sender}-${msg.timestamp}`,
        sources: msg.sources
      })),
      isMoreDataAvailable: data.isMoreDataAvailable
    };
  },

  // Send message
  sendMessage: async (message: string, retrievalCount: number = 5, productName: string = ""): Promise<APIResponse> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sendMessage`;
    const response = await authService.authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, productId: productName }),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Get basic products for chat interface (limited data)
  getProductsBasic: async (): Promise<BasicProduct[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/getProductsBasic`;
    const response = await authService.authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch basic products: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Handle the response format with data property
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    
    // Fallback to direct array for backward compatibility
    return Array.isArray(responseData) ? responseData : [];
  },

  // Get products (full data for library page)
  getProducts: async (): Promise<Product[]> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/getProducts`;
    const response = await authService.authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Handle both old format (direct array) and new format (wrapped in data property)
    if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }
    
    // Fallback to old format for backward compatibility
    return Array.isArray(responseData) ? responseData : [];
  },

  // Shared function to fetch product media (images and videos) - no caching
  getProductMedia: async (productId: string): Promise<ProductMediaResponse> => {
    console.log('📡 getProductMedia called with productId:', productId);
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/getProductMedia?productId=${productId}`;
    const response = await authService.authenticatedFetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product media: ${response.statusText}`);
    }

    const responseData: ProductMediaResponse = await response.json();
    
    console.log('📡 Returning media data:', responseData);
    return responseData;
  },

  // Get product images
  getProductImages: async (productId: string): Promise<ProductImagesResponse> => {
    console.log('📡 getProductImages called with productId:', productId);
    
    try {
      const mediaData = await chatApi.getProductMedia(productId);
      
      // Extract images from the media data
      const images: ProductImage[] = [];
      let productName = "Unknown Product";
      let imageIndex = 1;
      
      mediaData.data.forEach((item, itemIndex) => {
        if (itemIndex === 0) {
          productName = item.name || "Unknown Product";
        }
        
        item.media.forEach((media) => {
          if (media.type === 'image') {
            images.push({
              id: `img${imageIndex}`,
              name: item.name || `Image ${imageIndex}`,
              url: media.url,
              filename: `image_${imageIndex}.jpg`
            });
            imageIndex++;
          }
        });
      });

      const response: ProductImagesResponse = {
        productId,
        productName,
        images
      };

      console.log('📡 Returning images response:', response);
      return response;
    } catch (error) {
      console.error('📡 Error fetching product images:', error);
      throw error;
    }
  },

  // Get product videos
  getProductVideos: async (productId: string): Promise<ProductVideosResponse> => {
    console.log('🎥 getProductVideos called with productId:', productId);
    
    try {
      const mediaData = await chatApi.getProductMedia(productId);
      
      // Extract videos from the media data
      const videos: ProductVideo[] = [];
      let productName = "Unknown Product";
      let videoIndex = 1;
      
      mediaData.data.forEach((item, itemIndex) => {
        if (itemIndex === 0) {
          productName = item.name || "Unknown Product";
        }
        
        item.media.forEach((media) => {
          if (media.type === 'video') {
            videos.push({
              id: `vid${videoIndex}`,
              name: item.name || `Video ${videoIndex}`,
              url: media.url,
              filename: `video_${videoIndex}.mp4`,
              // These could be added to the API response later
              duration: undefined,
              size: undefined
            });
            videoIndex++;
          }
        });
      });

      const response: ProductVideosResponse = {
        productId,
        productName,
        videos
      };

      console.log('🎥 Returning videos response:', response);
      return response;
    } catch (error) {
      console.error('🎥 Error fetching product videos:', error);
      throw error;
    }
  },

  // Create product media
  createProductMedia: async (productId: string, mediaData: ProductMediaData): Promise<any> => {
    console.log('📤 Creating product media for productId:', productId, 'mediaData:', mediaData);
    
    const url = `${process.env.NEXT_PUBLIC_API_URL}/createProductMedia`;
    const response = await authService.authenticatedFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        mediaData
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product media: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('📤 Successfully created product media:', result);
    return result;
  }
};

// Document API calls
export const documentApi = {
  // Get all documents
  getDocuments: async (): Promise<Document[]> => {
    const apiUrl = getApiUrl('/api/documents');
    const response = await authService.authenticatedFetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Upload single file
  uploadFile: async (file: File, productName?: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', productName || file.name.replace(/\.[^/.]+$/, "")); // Remove file extension for default name
    
    // Use environment variable if available, otherwise fall back to the provided URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${apiBaseUrl}/createProduct`;
    
    const response = await authService.authenticatedFetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Upload URL
  uploadUrl: async (url: string, name: string): Promise<any> => {
    // For URL uploads, we'll need to implement this based on your backend
    // For now, this will throw an error since the current endpoint only supports file uploads
    throw new Error('URL uploads not yet supported by the API endpoint');
  },

  // Batch upload URLs
  batchUploadUrls: async (urls: string[], concurrency: number, retryAttempts: number): Promise<any> => {
    const apiUrl = getApiUrl('/api/documents/batch-upload-urls');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls, concurrency, retryAttempts }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Batch URL upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Batch upload files
  batchUploadFiles: async (files: FileList, concurrency: number, retryAttempts: number): Promise<any> => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('concurrency', concurrency.toString());
    formData.append('retryAttempts', retryAttempts.toString());
    
    const apiUrl = getApiUrl('/api/documents/batch-upload-files');
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Batch file upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete document
  deleteDocument: async (id: number): Promise<void> => {
    const apiUrl = getApiUrl(`/api/documents/${id}`);
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  },

  // Get batch jobs
  getBatchJobs: async (): Promise<BatchJob[]> => {
    const apiUrl = getApiUrl('/api/batch-jobs');
    const response = await authService.authenticatedFetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch batch jobs: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Cancel batch job
  cancelBatchJob: async (jobId: string): Promise<void> => {
    const apiUrl = getApiUrl(`/api/batch-jobs/${jobId}/cancel`);
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel job: ${response.statusText}`);
    }
  }
};

// Unanswered queries API calls
export const queriesApi = {
  // Get feedback questions
  getFeedbackQuestions: async (
    pageNumber: number, 
    pageSize: number, 
    status: string = ''
  ): Promise<FeedbackQuestionsResponse> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/getFeedbackQuestions?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`;

    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch queries: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      data: data.data?.map((q: any) => ({
        id: q.id,
        message: q.message,
        timestamp: q.timestamp,
        userId: q.userId,
        // userEmail: q.userEmail || q.email,
        context: q.context,
        status: q.status,
        priority: q.priority || 'medium',
        messageRef: q.messageRef,
        productName: q.productId,
        userName: q.userName,
        tags: (q.tags || []).map((tag: any): Tag => ({
          id: tag.id || tag.tagId || '',
          name: tag.name || tag.tagName || '',
          createdAt: tag.createdAt
        })),
      })) || [],
      totalCount: data.totalCount || 0,
      page: data.page || pageNumber.toString(),
      pageSize: data.pageSize || pageSize.toString(),
      totalPages: data.totalPages || Math.ceil((data.totalCount || 0) / pageSize),
      hasMore: data.hasMore || false
    };
  },

  // Mark query as resolved
  markAsResolved: async (queryId: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/markFeedbackQuestions`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status: 'resolved',
        id: queryId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark query as resolved');
    }
    
    return response.json();
  },

  // Update product with new documentation to enhance AI knowledge base
  updateProduct: async (file: File, name: string, productId: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('productId', productId);
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/updateProduct`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    return response.json();
  }
};

// Tag API calls
export const tagApi = {
  // Create a new tag
  createTag: async (name: string): Promise<Tag> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/createTag`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create tag: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Map response to our Tag interface
    return {
      id: responseData.id || responseData.tagId || '',
      name: responseData.name || responseData.tagName || name,
      createdAt: responseData.createdAt
    };
  },

  // Get all tags
  getTags: async (): Promise<Tag[]> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/getTags`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    const responseData = await response.json();
    let tagsArray: any[] = [];
    
    // Handle both wrapped and direct array responses
    if (responseData.data && Array.isArray(responseData.data)) {
      tagsArray = responseData.data;
    } else if (responseData.tags && Array.isArray(responseData.tags)) {
      tagsArray = responseData.tags;
    } else if (Array.isArray(responseData)) {
      tagsArray = responseData;
    }
    
    // Map backend response to our Tag interface
    return tagsArray.map((tag: any): Tag => ({
      id: tag.id || tag.tagId || '',
      name: tag.name || tag.tagName || '',
      createdAt: tag.createdAt
    }));
  },

  // Add tag to feedback question
  addTagToQuery: async (feedbackQuestionId: string, tagId: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/addTagToFeedbackQuestion`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedbackQuestionId, tagId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add tag to query: ${response.statusText}`);
    }

    return response.json();
  },

  // Remove tag from feedback question
  removeTagFromQuery: async (feedbackQuestionId: string, tagId: string): Promise<any> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/deleteTagFromFeedbackQuestion`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ feedbackQuestionId, tagId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to remove tag from query: ${response.statusText}`);
    }

    return response.json();
  }
};

// Quiz API calls
export const quizApi = {
  // Get quiz questions
  getQuizQuestions: async (topics: string[]): Promise<QuizResponse> => {
    const response = await fetch('http://localhost:5000/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'mcq',
        topics
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quiz questions');
    }

    return response.json();
  }
};

// User profile API calls
export const profileApi = {
  // Get user profile
  getUserProfile: async (): Promise<UserProfile> => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/profile`;
    
    const response = await authService.authenticatedFetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform the response to match our interface
    return {
      uid: data.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      userUsage: data.userUsage,
      allUsage: data.allUsage,
      createdAt: data.createdAt
    };
  }
};

// Settings API calls
export const settingsApi = {
  // Save settings
  saveSettings: async (settings: Record<string, any>): Promise<void> => {
    const promises = Object.entries(settings).map(([key, value]) => {
      const apiUrl = getApiUrl('/api/settings');
      return authService.authenticatedFetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: JSON.stringify(value) }),
      });
    });
    
    const responses = await Promise.all(promises);
    
    // Check if any request failed
    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error(`Failed to save setting: ${response.statusText}`);
      }
    });
  }
};

// QA Pairs API calls
export const qaPairsApi = {
  // Create QA pairs for knowledge base
  createQAPairs: async (payload: {
    id: string;
    answer: string;
    productId?: string;
  }): Promise<{ totalChunks: number; processedPairs: number; errors: any[] }> => {
    // Prefer a dedicated RAG API base if set; else default to localhost:5000 to match existing quiz API pattern
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const endpoint = `${baseUrl}/addAnswerToFeedbackQuestion`;

    const response = await authService.authenticatedFetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit QA pairs: ${response.statusText}`);
    }

    return response.json();
  },
};

// Generic API request helper (for backward compatibility)
export const apiRequest = async (
  method: string,
  url: string,
  data?: unknown
): Promise<Response> => {
  const apiUrl = getApiUrl(url);
  
  try {
    const res = await authService.authenticatedFetch(apiUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.statusText}`);
    }
    
    return res;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Authentication failed - redirecting to login')) {
      throw new Error('Session expired. Please log in again.');
    }
    throw error;
  }
}; 