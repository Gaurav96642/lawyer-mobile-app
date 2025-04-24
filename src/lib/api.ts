import axios from 'axios';

const API = axios.create({
  baseURL: 'http://webserver.greenacres-popcorn.com:7000/api', // 👈 Replace with your API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
