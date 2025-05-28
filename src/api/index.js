import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ffokildam.ru',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(
    config => {
      const token = localStorage.getItem('authToken');
      console.log('Interceptor token:', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => {
      if (!error.response) {
        console.error('Network error:', error);
        return Promise.reject(new Error('Network error. Please check your connection.'));
      }

      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      return Promise.reject(error);
    }
);


export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const token = response.data;
    localStorage.setItem('authToken', token);
    console.log('Saved token:', token);
    console.log('Stored token:', localStorage.getItem('authToken'));
    return { token };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};


export const getIdeas = async () => {
  try {
    const response = await api.get('/ideas');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch ideas:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch ideas');
  }
};

export const getIdeaById = async (id) => {
  try {
    const response = await api.get(`/ideas/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch idea:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch idea details');
  }
};

export const createIdea = async (ideaData) => {
  try {
    const data = {
      ...ideaData,
    };
    console.log('Creating idea:', data);
    const response = await api.post('/ideas', data);
    return response.data;
  } catch (error) {
    console.error('Failed to create idea:', error);
    throw new Error(error.response?.data?.message || 'Failed to create idea');
  }
};

export const voteForIdea = async (ideaId, voteType) => {
  try {
    const response = await api.post(`/ideas/${ideaId}/vote`, { voteType });
    return response.data;
  } catch (error) {
    console.error('Failed to vote:', error);
    throw new Error(error.response?.data?.message || 'Failed to vote for idea');
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/ideas/categories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const getStatuses = async () => {
  try {
    const response = await api.get('/ideas/statuses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch statuses:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch statuses');
  }
};

export const getComments = async (ideaId) => {
  try {
    const response = await api.get(`/ideas/${ideaId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch comments');
  }
};

export const createComment = async (ideaId, text) => {
  try {
    const response = await api.post(`/ideas/${ideaId}/comments`, { text });
    return response.data;
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw new Error(error.response?.data?.message || 'Failed to create comment');
  }
};

export const createReply = async (commentId, text) => {
  try {
    const response = await api.post(`/comments/${commentId}/replies`, { text });
    return response.data;
  } catch (error) {
    console.error('Failed to create reply:', error);
    throw new Error(error.response?.data?.message || 'Failed to create reply');
  }
};
