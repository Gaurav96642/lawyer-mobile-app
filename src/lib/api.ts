import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.29.229:5000/api', // 👈 Replace with your API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
