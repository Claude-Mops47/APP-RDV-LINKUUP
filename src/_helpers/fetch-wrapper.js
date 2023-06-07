
import axios from 'axios';
import { store, authActions } from '_store'

export const fetchWrapper = {
  get: request('get'),
  post: request('post'),
  put: request('put'),
  delete: request('delete'),
};

function request(method) {
  return async (url, body) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };

    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.data = JSON.stringify(body);
    }

    try {
      const response = await axios(url, requestOptions);
      // console.log(response);
      return handleResponse(response);
    } catch (error) {
      console.log(error);
      if (error.response && [401, 403].includes(error.response.status) && authToken()) {
        const logout = () => store.dispatch(authActions.logout());
        logout();
      }

      const errorMessage = (error.response && error.response.data && error.response.data.message) || error.message;
      return Promise.reject(errorMessage);
    }
  };
}

function authHeader(url) {
  const token = authToken();
  const isLoggedIn = !!token;
  const isApiUrl = url.startsWith(process.env.REACT_APP_API_URL);

  if (isLoggedIn && isApiUrl) {
    const userId = store.getState().auth.value?.user.id
    return { Authorization: `Bearer ${token}`, 'user-id': userId };
  } else {
    return {};
  }
}

function authToken() {
  return store.getState().auth.value?.token;
}

async function handleResponse(response) {
  const isJson = response.headers['content-type']?.includes('application/json');
  const data = isJson ? response.data : null;

  if (!response.status >= 200 && response.status < 300) {
    throw new Error((data && data.message) || response.status);
  }

  return data;
}

// Add the interceptor to the axios instance
// axios.interceptors.request.use(
//   (config) => {
//     const token = authToken();
//     // const isApiUrl = config.url.startsWith();
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );