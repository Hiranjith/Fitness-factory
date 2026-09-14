import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update if backend URL changes
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
