import instance from "axios";

const { VITE_API_URL } = import.meta.env
const axios = instance.create({
    baseURL: VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
})
axios.defaults.withCredentials = true;




instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "/usuarios/login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
          try {
            // const rs = await axios.get("/usuarios/");
            
            // const { accessToken } = rs.data;
            // TokenService.updateLocalAccessToken(accessToken);
  
            return axios(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
  
      return Promise.reject(err);
    }
  );

  export default axios;