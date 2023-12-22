import axios from "axios"

export const TOKEN_LOCAL = "token"

const appAxios = axios.create({
  baseURL: "http://localhost:3001", // Replace with your API base URL
})

// Request interceptor
appAxios.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
    const accessToken = localStorage.getItem(TOKEN_LOCAL)

    // If token is present add it to request's Authorization Header
    if (accessToken) {
      if (config.headers) config.headers.authorization = "Bearer " + accessToken
    }
    return config
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error)
  }
)
// End of Request interceptor

// Response interceptor
appAxios.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error)
  }
)
// End of Response interceptor

export default appAxios
