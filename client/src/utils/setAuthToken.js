import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.default.headers.common['Authorization'] = token;
  } else {
    // Delete the auth header
    delete axios.default.headers.common['Authorization'];
  }
}

export default setAuthToken;
