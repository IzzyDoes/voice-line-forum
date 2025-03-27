
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsApi = {
  getPosts: async (page = 1, sort = 'recent') => {
    try {
      const response = await api.get(`/posts?page=${page}&sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  getPost: async (id: string) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },
  
  createPost: async (title: string, content: string) => {
    try {
      const response = await api.post('/posts', { title, content });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  updatePost: async (id: string, title: string, content: string) => {
    try {
      const response = await api.put(`/posts/${id}`, { title, content });
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
  
  deletePost: async (id: string) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },
  
  upvotePost: async (id: string) => {
    try {
      const response = await api.post(`/posts/${id}/upvote`);
      return response.data;
    } catch (error) {
      console.error(`Error upvoting post ${id}:`, error);
      throw error;
    }
  },
  
  downvotePost: async (id: string) => {
    try {
      const response = await api.post(`/posts/${id}/downvote`);
      return response.data;
    } catch (error) {
      console.error(`Error downvoting post ${id}:`, error);
      throw error;
    }
  }
};

// Comments API
export const commentsApi = {
  getComments: async (postId: string, page = 1) => {
    try {
      const response = await api.get(`/comments/post/${postId}?page=${page}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
  
  createComment: async (postId: string, content: string) => {
    try {
      const response = await api.post('/comments', { postId, content });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
  
  deleteComment: async (id: string) => {
    try {
      const response = await api.delete(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error;
    }
  },
  
  upvoteComment: async (id: string) => {
    try {
      const response = await api.post(`/comments/${id}/upvote`);
      return response.data;
    } catch (error) {
      console.error(`Error upvoting comment ${id}:`, error);
      throw error;
    }
  },
  
  downvoteComment: async (id: string) => {
    try {
      const response = await api.post(`/comments/${id}/downvote`);
      return response.data;
    } catch (error) {
      console.error(`Error downvoting comment ${id}:`, error);
      throw error;
    }
  }
};

// Auth API
export const authApi = {
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  isAuthenticated: () => {
    return localStorage.getItem('authToken') !== null;
  }
};

// User API
export const userApi = {
  getProfile: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user profile ${id}:`, error);
      throw error;
    }
  },
  
  updateProfile: async (username: string) => {
    try {
      const response = await api.put('/users/profile', { username });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
};
