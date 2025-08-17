import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://salamp.id/api/v1' : 'http://localhost:3000/api/v1';
const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default client;
