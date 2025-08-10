interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
  method?: string;
}

interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${options.method || 'GET'} ${endpoint}`, error);
      throw error;
    }
  }

  // Project methods
  async getProjects(): Promise<ApiResponse> {
    return this.request('/projects');
  }

  async createProject(projectData: any): Promise<ApiResponse> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProject(id: string): Promise<ApiResponse> {
    return this.request(`/projects/${id}`);
  }

  async updateProject(id: string, projectData: any): Promise<ApiResponse> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(id: string): Promise<ApiResponse> {
    return this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  async getFinancialStatements(projectId: string): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}/financial-statements`);
  }

  async createFinancialStatement(projectId: string, data: any): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}/financial-statements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBudgetPlans(projectId: string): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}/budget-plans`);
  }

  async createBudgetPlan(projectId: string, data: any): Promise<ApiResponse> {
    return this.request(`/projects/${projectId}/budget-plans`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/projects/stats');
  }

  // Learning methods
  async getCaseStudies(): Promise<ApiResponse> {
    return this.request('/learning/case-studies');
  }

  async getCaseStudy(id: string): Promise<ApiResponse> {
    return this.request(`/learning/case-studies/${id}`);
  }

  async startCaseStudyAttempt(id: string): Promise<ApiResponse> {
    return this.request(`/learning/case-studies/${id}/attempt`, { method: 'POST' });
  }

  async updateCaseStudyAttempt(id: string, attemptId: string, data: any): Promise<ApiResponse> {
    return this.request(`/learning/case-studies/${id}/attempt/${attemptId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getExercises(): Promise<ApiResponse> {
    return this.request('/learning/exercises');
  }

  async getExercise(id: string): Promise<ApiResponse> {
    return this.request(`/learning/exercises/${id}`);
  }

  async submitExerciseAttempt(id: string, answer: number): Promise<ApiResponse> {
    return this.request(`/learning/exercises/${id}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ answer }),
    });
  }

  async getLearningProgress(): Promise<ApiResponse> {
    return this.request('/learning/progress');
  }

  async getAchievements(): Promise<ApiResponse> {
    return this.request('/learning/achievements');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    const response = await fetch('http://localhost:3001/health');
    return response.json();
  }
}

const apiClient = new ApiClient();
export default apiClient;
export type { ApiResponse, PaginatedResponse };