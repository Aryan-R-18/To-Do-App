import axios from 'axios';

const API_BASE_URL = 'http://localhost:1000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (userData) => {
    try {
      console.log('Registering user:', userData);
      const response = await api.post('/api/v1/register', userData);
      console.log('Registration response:', response);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response || error);
      throw {
        message: error.response?.data?.message || error.message || 'Registration failed',
        status: error.response?.status
      };
    }
  },

  signin: async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw { message: 'Email and password are required' };
      }

      console.log('Signing in user:', { email: credentials.email });
      const response = await api.post('/api/v1/signin', {
        email: credentials.email.trim(),
        password: credentials.password
      });

      if (!response.data || !response.data.user) {
        throw { message: 'Invalid response from server' };
      }

      console.log('Signin response:', response);
      return response.data;
    } catch (error) {
      console.error('Signin error:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || 'Invalid email or password';
      throw { message: errorMessage };
    }
  },
};

// Task APIs
export const taskAPI = {
  getTasks: async (userId) => {
    try {
      const response = await api.get(`/api/v2/getTasks/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  },

  addTask: async (taskData) => {
    try {
      const response = await api.post('/api/v2/addTask', taskData);
      return response.data;
    } catch (error) {
      console.error('Add task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to add task');
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/api/v2/updateTask/${taskId}`, {
        ...taskData,
        email: taskData.email // Send email instead of user ID
      });
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  },

  deleteTask: async (taskId, data) => {
    try {
      const response = await api.delete(`/api/v2/deleteTask/${taskId}`, { data });
      return response.data;
    } catch (error) {
      console.error('Delete task error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  },
}; 