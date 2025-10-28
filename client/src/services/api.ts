import axios from 'axios';
import {
  GenerateRequest,
  GenerateResponse,
  IconCollection,
  ApiResponse
} from '../types';

const BASE_URL = window.location.origin.split(':').slice(0, 2).join(':');
const SERVICE_PORT = '3001';

const api = axios.create({
  baseURL: `${BASE_URL}:${SERVICE_PORT}/api`,
  timeout: 300000, // 5 minutes timeout for AI generation
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      '❌ API Response Error:',
      error.response?.data || error.message
    );

    // Handle specific error cases
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    if (error.response?.status === 503) {
      throw new Error(
        'AI service temporarily unavailable. Please try again later.'
      );
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'Request timeout. The AI generation might take longer than expected.'
      );
    }

    throw error;
  }
);

export const aiApi = {
  // Generate icons from text prompt
  generateIcons: async (
    request: GenerateRequest
  ): Promise<GenerateResponse> => {
    const response = await api.post('/ai/generate', request);
    return response.data;
  },

  // Check AI service health
  healthCheck: async () => {
    const response = await api.get('/ai/health');
    return response.data;
  }
};

export const iconsApi = {
  // Save icon collection
  saveCollection: async (collection: {
    icons: any[];
    collection_name?: string;
  }): Promise<ApiResponse<IconCollection>> => {
    const response = await api.post('/icons/save', collection);
    return response.data;
  },

  // Get all icon collections
  getCollections: async (
    page = 1,
    limit = 10
  ): Promise<
    ApiResponse<{
      collections: IconCollection[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>
  > => {
    const response = await api.get(
      `/icons/library?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get specific collection by ID
  getCollection: async (id: string): Promise<ApiResponse<IconCollection>> => {
    const response = await api.get(`/icons/${id}`);
    return response.data;
  },

  // Delete collection
  deleteCollection: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.delete(`/icons/${id}`);
    return response.data;
  },

  // Validate SVG
  validateSVG: async (
    svg: string
  ): Promise<
    ApiResponse<{
      is_valid: boolean;
      size: number;
      element_count: number;
    }>
  > => {
    const response = await api.post('/icons/validate', { svg });
    return response.data;
  }
};

export default api;
