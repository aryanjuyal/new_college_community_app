import axios from 'axios';

// Get the API URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

/*
  This is an "interceptor". It's a piece of code that runs
  before every single API request.

  It checks if we have a token in local storage.
  If we do, it adds it to the 'Authorization' header.
  This is how you prove you are "logged in" for every protected request.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('collegeAppToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Service ---
export const login = (username, password) => api.post('/auth/login/', { username, password });
export const register = (userData) => api.post('/auth/register/', userData);
export const getMe = () => api.get('/auth/me/');

// --- Post Service ---
export const getPosts = () => api.get('/posts/');
export const createPost = (formData) => api.post('/posts/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data', // Important for file uploads
  },
});
export const deletePost = (postId) => api.delete(`/posts/${postId}/`);
export const addComment = (postId, text) => api.post(`/posts/${postId}/comment/`, { text });

// --- Event Service ---
export const getEvents = () => api.get('/events/');
export const createEvent = (eventData) => api.post('/events/', eventData);

// --- User/Profile Service ---
export const updateProfile = (profileData) => api.put('/users/profile/', profileData);

// --- Chat Service ---
// (These are placeholders - they will need a real-time backend)
export const getUsersForChat = () => api.get('/users/'); // An endpoint to get all users
export const getChatMessages = (userId) => api.get(`/chat/${userId}/`); // An endpoint to get history
export const sendChatMessage = (userId, text) => api.post(`/chat/${userId}/`, { text });

// --- Search Service ---
export const searchApp = (query) => api.get(`/search/?q=${query}`);

export default api;