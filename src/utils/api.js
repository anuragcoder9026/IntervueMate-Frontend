import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    withCredentials: true, // Send cookies with requests
});

export default api;
