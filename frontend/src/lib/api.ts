import { Project, AuthResponse, Contact, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${authData.state.token}`,
          };
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async getAdminProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects/admin/all');
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Contact
  async submitContact(contact: { name: string; email: string; message: string }): Promise<{ message: string; id: number }> {
    return this.request<{ message: string; id: number }>('/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async getContacts(): Promise<Contact[]> {
    return this.request<Contact[]>('/contact');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

