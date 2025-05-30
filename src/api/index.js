import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.ffokildam.ru',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);


export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  console.log(response);
  const token = response.data.Token;
  const uid = response.data.Uid
  return {token, uid};
};

export const getUserByUID = async (uid) => {
  const response = await api.get(`/users/${uid}`);
  return response.data;
};

export const getIdeas = async () => {
  const response = await api.get('/ideas');
  return response.data;
};

export const getIdeaByUID = async (uid) => {
  const response = await api.get(`/ideas/${uid}`);
  return response.data;
};

export const likeIdea = async (ideaId) => {
  const response = await api.post(`/ideas/${ideaId}/like`);
  if (response.data !== 'ok') {
    throw new Error('Failed to like the idea');
  }
  return response.data;
};

export const dislikeIdea = async (ideaId) => {
  const response = await api.post(`/ideas/${ideaId}/dislike`);
  if (response.data !== 'ok') {
    throw new Error('Failed to dislike the idea');
  }
  return response.data;
};

export const getComments = async (ideaUID) => {
  const response = await api.get(`/ideas/${ideaUID}/comments`);
  return response.data;
};

export const createComment = async (ideaUID, commentText) => {
  const response = await api.post('/comments', {
    commentText,
    ideaUID
  });
  return response.data;
};


export const createReply = async (commentUID, replyText) => {
  console.log(commentUID, replyText);
  const response = await api.post('/replies', { commentUID, replyText });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/ideas/categories');
  return response.data;
};

export const getStatuses = async () => {
  const response = await api.get('/ideas/statuses');
  return response.data;
};

export const createIdea = async (ideaData) => {
  const response = await api.post('/ideas', ideaData);
  return response.data;
};

export const register = async (registerData) => {
  const response = await api.post('/register', registerData);
  return response.data;
};

export const getPositions = async () => {
  const response = await api.get('/users/positions');
  console.log(response);
  return response.data;
};