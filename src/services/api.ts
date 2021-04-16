import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.33:5000',
});

export default api;
