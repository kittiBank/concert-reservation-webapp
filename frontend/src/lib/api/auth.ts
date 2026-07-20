import { apiRequest } from "@/lib/api/client";
import type {
  ApiItemResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
} from "@/types";

export async function login(input: LoginInput): Promise<AuthResponse> {
  const response = await apiRequest<ApiItemResponse<AuthResponse>>(
    "/auth/login",
    { method: "POST", body: input, auth: false },
  );
  return response.data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const response = await apiRequest<ApiItemResponse<AuthResponse>>(
    "/auth/register",
    { method: "POST", body: input, auth: false },
  );
  return response.data;
}
