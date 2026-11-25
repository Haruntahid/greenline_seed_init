/**
 * GreenLine Seed - Unified API Client
 * Provides type-safe CRUD operations and JWT auth against the MongoDB backend.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  accessToken = token;
}

export function getAuthToken(): string | null {
  return accessToken;
}

export function registerUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function buildApiHeaders(extra?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {};
  if (extra) {
    const normalized = new Headers(extra);
    normalized.forEach((value, key) => {
      headers[key] = value;
    });
  }
  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = buildApiHeaders({
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && !endpoint.startsWith('/auth/login')) {
    accessToken = null;
    unauthorizedHandler?.();
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Admin JWT Auth
  auth: {
    login: (uuid: string, password: string) =>
      request<{
        success: boolean;
        token: string;
        user: { uuid: string; role: 'admin' | 'editor'; displayName: string; authenticatedAt: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ uuid, password }),
      }),
    me: () =>
      request<{
        success: boolean;
        user: { uuid: string; role: 'admin' | 'editor'; displayName: string; authenticatedAt: string };
      }>('/auth/me'),
    refresh: () =>
      request<{
        success: boolean;
        token: string;
        user: { uuid: string; role: 'admin' | 'editor'; displayName: string; authenticatedAt: string };
      }>('/auth/refresh', { method: 'POST' }),
    logout: () => request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
    listUsers: () =>
      request<{
        success: boolean;
        data: Array<{
          uuid: string;
          displayName: string;
          role: 'admin' | 'editor';
          active: boolean;
          createdAt?: string;
          lastLoginAt?: string;
        }>;
      }>('/auth/users'),
    createUser: (user: { uuid: string; displayName: string; password: string; role: 'admin' | 'editor' }) =>
      request<{ success: boolean; message: string; user: any }>('/auth/users', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
    deleteUser: (uuid: string) =>
      request<{ success: boolean; message: string }>(`/auth/users/${encodeURIComponent(uuid)}`, {
        method: 'DELETE',
      }),
  },

  // Hero Content CRUD
  hero: {
    get: () => request<{ success: boolean; data: any }>('/hero'),
    update: (content: any) => request<{ success: boolean; data: any }>('/hero', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/hero/reset', { method: 'POST' }),
  },

  // Hero Carousel CRUD
  heroCarousel: {
    get: () => request<{ success: boolean; data: any }>('/hero-carousel'),
    update: (content: any) => request<{ success: boolean; data: any }>('/hero-carousel', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/hero-carousel/reset', { method: 'POST' }),
  },

  // About Content CRUD
  about: {
    get: () => request<{ success: boolean; data: any }>('/about'),
    update: (content: any) => request<{ success: boolean; data: any }>('/about', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/about/reset', { method: 'POST' }),
  },

  // About Us Page Content CRUD
  aboutPage: {
    get: () => request<{ success: boolean; data: any }>('/about-page'),
    update: (content: any) => request<{ success: boolean; data: any }>('/about-page', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/about-page/reset', { method: 'POST' }),
  },

  // Gallery Content CRUD
  gallery: {
    get: () => request<{ success: boolean; data: any }>('/gallery'),
    update: (content: any) => request<{ success: boolean; data: any }>('/gallery', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/gallery/reset', { method: 'POST' }),
  },

  // YouTube Videos Content CRUD
  youtubeVideos: {
    get: () => request<{ success: boolean; data: any }>('/youtube-videos'),
    update: (content: any) => request<{ success: boolean; data: any }>('/youtube-videos', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; data: any }>('/youtube-videos/reset', { method: 'POST' }),
  },

  // Services CRUD
  services: {
    list: (params?: { enabled?: boolean }) => {
      const query = params?.enabled ? '?enabled=true' : '';
      return request<{ success: boolean; data: any[] }>(`/services${query}`);
    },
    get: (id: string) => request<{ success: boolean; data: any }>(`/services/${id}`),
    create: (service: any) => request<{ success: boolean; data: any }>('/services', { method: 'POST', body: JSON.stringify(service) }),
    update: (id: string, service: any) => request<{ success: boolean; data: any }>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(service) }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/services/${id}`, { method: 'DELETE' }),
    getMeta: () => request<{ success: boolean; data: any }>('/services/meta/content'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/services/meta/content', { method: 'PUT', body: JSON.stringify(meta) }),
    updateContent: (content: any) => request<{ success: boolean; data: any }>('/services/content', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; message: string }>('/services/reset', { method: 'POST' }),
  },

  // Stats CRUD
  stats: {
    list: (params?: { enabled?: boolean }) => {
      const query = params?.enabled ? '?enabled=true' : '';
      return request<{ success: boolean; data: any[] }>(`/stats${query}`);
    },
    get: (id: string) => request<{ success: boolean; data: any }>(`/stats/${id}`),
    create: (stat: any) => request<{ success: boolean; data: any }>('/stats', { method: 'POST', body: JSON.stringify(stat) }),
    update: (id: string, stat: any) => request<{ success: boolean; data: any }>(`/stats/${id}`, { method: 'PUT', body: JSON.stringify(stat) }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/stats/${id}`, { method: 'DELETE' }),
    getMeta: () => request<{ success: boolean; data: any }>('/stats/meta/content'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/stats/meta/content', { method: 'PUT', body: JSON.stringify(meta) }),
    updateContent: (content: any) => request<{ success: boolean; data: any }>('/stats/content', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; message: string }>('/stats/reset', { method: 'POST' }),
  },

  // Projects / Portfolio CRUD
  projects: {
    list: (params?: { category?: string; featured?: boolean; enabled?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set('category', params.category);
      if (params?.featured) searchParams.set('featured', 'true');
      if (params?.enabled) searchParams.set('enabled', 'true');
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ success: boolean; data: any[] }>(`/projects${query}`);
    },
    get: (idOrSlug: string) => request<{ success: boolean; data: any }>(`/projects/${idOrSlug}`),
    create: (project: any) => request<{ success: boolean; data: any }>('/projects', { method: 'POST', body: JSON.stringify(project) }),
    update: (id: string, project: any) => request<{ success: boolean; data: any }>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(project) }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/projects/${id}`, { method: 'DELETE' }),
    getMeta: () => request<{ success: boolean; data: any }>('/projects/meta/content'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/projects/meta/content', { method: 'PUT', body: JSON.stringify(meta) }),
    updateContent: (content: any) => request<{ success: boolean; data: any }>('/projects/content', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; message: string }>('/projects/reset', { method: 'POST' }),
  },

  // Products CRUD
  products: {
    list: (params?: {
      categoryId?: string;
      search?: string;
      featured?: boolean;
      enabled?: boolean;
      stockStatus?: string;
      sortBy?: string;
      page?: number;
      limit?: number;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));
      if (params?.enabled !== undefined) searchParams.set('enabled', String(params.enabled));
      if (params?.stockStatus) searchParams.set('stockStatus', params.stockStatus);
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{
        success: boolean;
        data: any[];
        pagination?: { total: number; page: number; limit: number; totalPages: number };
      }>(`/products${query}`);
    },
    get: (idOrSlug: string) => request<{ success: boolean; data: any }>(`/products/${idOrSlug}`),
    create: (product: any) => request<{ success: boolean; data: any }>('/products', { method: 'POST', body: JSON.stringify(product) }),
    update: (id: string, product: any) => request<{ success: boolean; data: any }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/products/${id}`, { method: 'DELETE' }),
    getCategories: () => request<{ success: boolean; data: any[] }>('/products/categories'),
    getCategory: (id: string) => request<{ success: boolean; data: any }>(`/products/categories/${id}`),
    createCategory: (cat: any) => request<{ success: boolean; data: any }>('/products/categories', { method: 'POST', body: JSON.stringify(cat) }),
    updateCategory: (id: string, cat: any) => request<{ success: boolean; data: any }>(`/products/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
    deleteCategory: (id: string) => request<{ success: boolean; message: string }>(`/products/categories/${id}`, { method: 'DELETE' }),
    getMeta: () => request<{ success: boolean; data: any }>('/products/meta/content'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/products/meta/content', { method: 'PUT', body: JSON.stringify(meta) }),
    updateContent: (content: any) => request<{ success: boolean; data: any }>('/products/content', { method: 'PUT', body: JSON.stringify(content) }),
    reset: () => request<{ success: boolean; message: string }>('/products/reset', { method: 'POST' }),
  },

  // Blogs CRUD
  blogs: {
    list: (params?: { categoryId?: string; search?: string; featured?: boolean; enabled?: boolean; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.featured) searchParams.set('featured', 'true');
      if (params?.enabled) searchParams.set('enabled', 'true');
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return request<{ success: boolean; data: any[]; pagination?: any }>(`/blogs${query}`);
    },
    get: (idOrSlug: string) => request<{ success: boolean; data: any }>(`/blogs/${idOrSlug}`),
    create: (article: any) => request<{ success: boolean; data: any }>('/blogs', { method: 'POST', body: JSON.stringify(article) }),
    update: (id: string, article: any) => request<{ success: boolean; data: any }>(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(article) }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/blogs/${id}`, { method: 'DELETE' }),
    getCategories: () => request<{ success: boolean; data: any[] }>('/blogs/categories'),
    createCategory: (cat: any) => request<{ success: boolean; data: any }>('/blogs/categories', { method: 'POST', body: JSON.stringify(cat) }),
    getMeta: () => request<{ success: boolean; data: any }>('/blogs/meta/content'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/blogs/meta/content', { method: 'PUT', body: JSON.stringify(meta) }),
    reset: () => request<{ success: boolean; message: string }>('/blogs/reset', { method: 'POST' }),
  },

  // Contact CRUD & Submissions
  contact: {
    getMeta: () => request<{ success: boolean; data: any }>('/contact/meta'),
    updateMeta: (meta: any) => request<{ success: boolean; data: any }>('/contact/meta', { method: 'PUT', body: JSON.stringify(meta) }),
    submitMessage: (message: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
      request<{ success: boolean; message: string; data: any }>('/contact', { method: 'POST', body: JSON.stringify(message) }),
    getMessages: () => request<{ success: boolean; data: any[] }>('/contact/messages'),
    updateMessageStatus: (id: string, status: 'read' | 'unread') =>
      request<{ success: boolean; data: any }>(`/contact/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    deleteMessage: (id: string) => request<{ success: boolean; message: string }>(`/contact/messages/${id}`, { method: 'DELETE' }),
  },

  // Settings & Theme
  settings: {
    getSite: () => request<{ success: boolean; data: any }>('/settings/site'),
    updateSite: (site: any) => request<{ success: boolean; data: any }>('/settings/site', { method: 'PUT', body: JSON.stringify(site) }),
    getSections: () => request<{ success: boolean; data: any[] }>('/settings/sections'),
    updateSections: (sections: any[]) => request<{ success: boolean; data: any[] }>('/settings/sections', { method: 'PUT', body: JSON.stringify(sections) }),
    getTheme: () => request<{ success: boolean; data: any }>('/settings/theme'),
    updateTheme: (theme: any) => request<{ success: boolean; data: any }>('/settings/theme', { method: 'PUT', body: JSON.stringify(theme) }),
  },

  // Media
  media: {
    upload: (name: string, type: string, dataUrl: string) =>
      request<{ success: boolean; id: string; url: string; dataUrl: string }>('/media/upload', {
        method: 'POST',
        body: JSON.stringify({ name, type, data: dataUrl }),
      }),
    saveByKey: (key: string, name: string, type: string, dataUrl: string) =>
      request<{ success: boolean; key: string; url: string }>(`/media/key/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: JSON.stringify({ name, type, data: dataUrl }),
      }),
    deleteByKey: (key: string) =>
      request<{ success: boolean; message: string }>(`/media/key/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      }),
    list: () => request<{ success: boolean; data: any[] }>('/media'),
    saveLink: (link: { title: string; url: string; category?: string }) =>
      request<{ success: boolean; message: string; data: any }>('/media/link', {
        method: 'POST',
        body: JSON.stringify(link),
      }),
    delete: (id: string) => request<{ success: boolean; message: string }>(`/media/${id}`, { method: 'DELETE' }),
  },

  // Assistant
  assistant: {
    get: () => request<{ success: boolean; data: any }>('/assistant'),
    update: (config: any) =>
      request<{ success: boolean; message: string; data: any }>('/assistant', {
        method: 'PUT',
        body: JSON.stringify(config),
      }),
  },

  // Health
  health: () => request<{ status: string; database: string; connected: boolean; collectionsCount: number }>('/health'),
};
