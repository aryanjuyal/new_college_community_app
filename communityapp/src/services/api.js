import axios from 'axios';

// Get the API URL from the environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// --- Main API for your Django Backend ---
const api = axios.create({
  baseURL: API_BASE_URL,
});

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

// --- NEW: Separate API for your local Chatbot ---
// This one is separate because it doesn't need your auth token
// This is the URL you will change to your local bot's address
const CHATBOT_URL = 'http://localhost:8001/chat'; // <-- CHANGE THIS

const chatbotApi = axios.create({
  baseURL: CHATBOT_URL,
});

// --- Auth Service ---
export const login = (username, password) => api.post('/auth/login/', { username, password });
export const register = (userData) => api.post('/auth/register/', userData);
export const getMe = () => api.get('/auth/me/');

// --- Post Service ---
export const getPosts = () => api.get('/posts/');
export const createPost = (formData) => api.post('/posts/', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
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
export const getUsersForChat = () => api.get('/users/');
export const getChatMessages = (userId) => api.get(`/chat/${userId}/`);
export const sendChatMessage = (userId, text) => api.post(`/chat/${userId}/`, { text });

// --- Search Service ---
export const searchApp = (query) => api.get(`/search/?q=${query}`);

// --- Lost & Found Service ---
export const getLostAndFoundItems = () => api.get('/lost-and-found/');
export const createLostItem = (itemData) => api.post('/lost-and-found/', itemData);
export const markItemAsFound = (itemId) => api.patch(`/lost-and-found/${itemId}/`, { status: 'found' });

// --- NEW: Chatbot Service Function ---
export const queryChatbot = (message) => chatbotApi.post('/', { message });

export default api;