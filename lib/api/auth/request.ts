import BaseApi from "@/lib/api/_base.api";
import { setCookie, destroyCookie } from "nookies";
import persistentStore from "@/lib/store/persistentStore";

// Constants
const APIDOMAIN = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_TOKEN || "";

// Types
interface RegisterPayload {
  // Add appropriate fields
  email: string;
  password: string;
  // ... other fields
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  password_confirmation: string;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export default class AuthApi {
  // private static readonly BASE_URL = APIDOMAIN + "/api";
  private static readonly BASE_URL = APIDOMAIN;

  private static async apiCall<T>(
    endpoint: string,
    payload?: any
  ): Promise<ApiResponse<T>> {
    try {
      return await BaseApi.post(`${this.BASE_URL}${endpoint}`, payload);
    } catch (error) {
      throw error;
    }
  }

  static async register(payload: RegisterPayload): Promise<ApiResponse> {
    return this.apiCall("/register", payload);
  }

  static async login(payload: LoginPayload): Promise<ApiResponse> {
    const response = await this.apiCall<{ token: string }>("/login", payload);

    setCookie({}, TOKEN, response?.data?.token?.token, {
      path: "/",
    });
    return response;
  }

  static async logout(): Promise<void> {
    destroyCookie(null, TOKEN);
    persistentStore.setState({ account: "" });
    persistentStore.setState({ stores: [] });
    window.location.href = "/";
  }

  static async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ApiResponse> {
    return this.apiCall("/account/password/email", payload);
  }

  static async verifyAccount(): Promise<ApiResponse> {
    return this.apiCall("/account/verification/resend");
  }

  static async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await this.apiCall("/account/password/reset", payload);
  }
}
