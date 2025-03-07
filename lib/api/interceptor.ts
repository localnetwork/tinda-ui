import { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "app_token";
const RATE_LIMIT_KEY = process.env.NEXT_PUBLIC_RATE_LIMIT_KEY || "";

let context: GetServerSidePropsContext | null = null;
export const setContext = (_context: GetServerSidePropsContext) => {
  context = _context;
};

const isServer = () => {
  return typeof window === "undefined";
};

const getToken = (): string | undefined => {
  if (isServer() && context) {
    const serverCookies = context.req?.headers?.cookie;
    if (serverCookies) {
      const parsedCookies = Object.fromEntries(
        serverCookies.split("; ").map((c) => c.split("="))
      );
      return parsedCookies[TOKEN];
    }
  } else {
    const cookies = parseCookies();
    return cookies[TOKEN];
  }
};

const setupRequestInterceptor = (axios: AxiosInstance) => {
  return axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["Strict-Transport-Security"] = "max-age=31536000";
    config.headers["X-Rate-Key"] = RATE_LIMIT_KEY;
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
