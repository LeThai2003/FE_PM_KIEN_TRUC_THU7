import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { API_PATHS, BASE_URL } from "./apiPath";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// axios không có interceptor
const plainAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

const refreshToken = async () => {
  try {
    const response = await plainAxios.post(API_PATHS.AUTH.REFRESH_TOKEN, {});
    return response.data;
  } catch (error) {
    console.log("Lỗi khi refresh token", error);
    throw error;
  }
}


axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("token");
    if(accessToken)
    {
      const decodedToken = jwtDecode(accessToken);
      // console.log(decodedToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        try {
          const data = await refreshToken();

          const newAccessToken = data.accessToken;

          localStorage.setItem("token", newAccessToken);

          accessToken = newAccessToken;
        } catch (error) {
          console.error("Lỗi refresh token:", error);
        }
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, 
  (error) => {return Promise.reject(error)}
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response)
    {
      console.log(error.response);
      if(error.response.status == 401 || error.response.statusCode == 401)
      {
        window.location.href = "/login"
      }
      else if(error.response.status == 500 || error.response.statusCode == 500)
      {
        console.error("Server error");
      }
    }
    else if(error.code == "ECONNABORTED")
    {
      console.error("Request timeout")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;