import axios from 'axios';

// Create a centralized Axios instance
export const api = axios.create({
    baseURL: 'http://localhost:8080/api/employees', // Matches your Backend Controller @RequestMapping
    headers: {
        'Content-Type': 'application/json',
    },
});
