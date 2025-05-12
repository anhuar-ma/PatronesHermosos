import axios from 'axios';

// Function to be called from context on component mount
export const setupAxiosInterceptors = (logout) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // If token is invalid or expired, logout user
        logout();
      }
      return Promise.reject(error);
    }
  );
};