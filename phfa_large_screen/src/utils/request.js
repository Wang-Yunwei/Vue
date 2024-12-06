import axios from "axios";
import { notification } from 'ant-design-vue';
import { VueAxios } from "./axios";

const request = axios.create({
  baseURL: GLOBAL_APP_API_BASE_URL,
  timeout: 8000,
});

const isProd = ["prod", "production"].includes(process.env.NODE_ENV);

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data;
    if (error.response.status === 403 || error.response.status === 500) {
      notification.error({
        message: "Forbidden",
        description: data.message,
      });
    }
    if (
      error.response.status === 401 &&
      !(data.result && data.result.isLogin)
    ) {
      notification.error({
        message: "Unauthorized",
        description: "Authorization verification failed",
      });
    }
  }
  return Promise.reject(error);
};

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('businessToken');
  if (token) {
    config.headers["jwt-token"] = token;
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  return response.data;
}, errorHandler);





const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export { installer as VueAxios, request as axios };

export default request;