import { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { parseCookies } from "nookies";
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "app_token";
const RATE_LIMIT_KEY = process.env.NEXT_PUBLIC_RATE_LIMIT_KEY || "";
interface Headers {
  Authorization: string;
  "X-Rate-Key": string;
  "Strict-Transport-Security": string;
}

const setupRequestInterceptor = (axios: AxiosInstance) => {
  return axios.interceptors.request.use((config) => {
    const cookies = parseCookies();

    console.log("cookies", cookies);

    const token = cookies[TOKEN];

    console.log("token", token);

    const headers: Headers = {
      Authorization: `Bearer ${token || ""}`,
      "X-Rate-Key": RATE_LIMIT_KEY,
      "Strict-Transport-Security": "max-age=31536000",
    };

    config.headers = { ...config.headers, ...headers };
    return config;
  });
};

const setupResponseInterceptor = (axios: AxiosInstance) => {
  return axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => Promise.reject(error?.response)
  );
};

export default function setup(axios: AxiosInstance): void {
  setupRequestInterceptor(axios);
  setupResponseInterceptor(axios);
}
