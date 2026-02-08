import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}` 
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`)
    }
    
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`)
    }
    return response
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message
    
    // Show user-friendly error messages
    const errorMap = {
      'Network Error': 'Unable to connect to the server. Please check your connection.',
      'timeout of 10000ms exceeded': 'Request timeout. Please try again.',
    }
    
    const userMessage = errorMap[errorMessage] || 
      `Error: ${error.response?.status || 'Unknown'} - ${errorMessage}` 
    
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    })
    
    // Create enhanced error object
    const enhancedError = {
      ...error,
      userMessage,
      originalError: error
    }
    
    return Promise.reject(enhancedError)
  }
)

export default api
