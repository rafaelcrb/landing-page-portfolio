export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  images: string[];
  link?: string;
  isVisible: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

