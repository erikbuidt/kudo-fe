import { type AuthResponse } from "@/types/auth.type";
import { http } from "../utils/http";

export const authApi = {
    signIn: (body: { email: string; password: string }) =>
        http.post<AuthResponse>('auth/login', body),
    signUp: (body: { username: string; display_name?: string; email: string; password: string }) =>
        http.post('auth/register', body),
    logout: () => http.post('auth/logout'),
}