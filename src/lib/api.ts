import axios from 'axios';

const API = axios.create({
  baseURL: 'http://98.84.233.111:7000/api', // 👈 Replace with your API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
