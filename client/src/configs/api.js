import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'https://web-ai-resume-builder.onrender.com',
    withCredentials: true, // CRITICAL: Enable cookies for authentication
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor to add token from localStorage if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem('token')
            // Redirect to login if not already there
            if (window.location.pathname !== '/' && !window.location.pathname.includes('/view/')) {
                window.location.href = '/'
            }
        }
        return Promise.reject(error)
    }
)

export default api