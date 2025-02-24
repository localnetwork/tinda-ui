import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import interceptorSetup from "./interceptor";
import useSWR, { SWRConfiguration, Key } from "swr";

// Setup interceptors
interceptorSetup(axios);
const basicAxios = axios.create();

interface ApiResponse<T = any> {
  data: T;
  mutate?: () => Promise<any>;
  isValidating?: boolean;
  error?: Error;
}

export default class BaseApi {
  static async get<T = any>(url: string): Promise<AxiosResponse<T>> {
    return axios.get<T>(url);
  }

  static async post<T = any>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.post<T>(url, data);
    } catch (error) {
      throw error;
    }
  }

  static async put<T = any>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.put<T>(url, data);
    } catch (error) {
      throw error;
    }
  }

  static async patch<T = any>(
    url: string,
    data?: any
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios.patch<T>(url, data);
    } catch (error) {
      throw error;
    }
  }

  static async delete<T = any>(url: string): Promise<AxiosResponse<T>> {
    try {
      return await axios.delete<T>(url);
    } catch (error) {
      throw error;
    }
  }

  static swr<T = any>(
    url: Key,
    options: SWRConfiguration = {}
  ): ApiResponse<T> {
    const fetcher = (link: string) => this.get<T>(link);
    const render = "render" in options ? options.render : true;

    const { data, mutate, isValidating, error } = useSWR<AxiosResponse<T>>(
      render ? url : null,
      fetcher,
      options
    );

    return {
      data: data?.data,
      mutate,
      isValidating,
      error,
    };
  }

  // No Interceptor methods
  static async customGet<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return basicAxios.get<T>(url, config);
  }

  static async customPut<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return basicAxios.put<T>(url, data, config);
  }
}
