import { type AuthResponse } from "@/types/auth.type";
import { http } from "../utils/http";

export const URL_SIGN_IN = 'auth/sign-in'
export const URL_SIGN_UP = 'auth/sign-up'
export const URL_SIG_OUT = 'auth/sign-out'

export const authApi = {
    signIn: (body: { username: string; password: string }) => http.post<AuthResponse>(URL_SIGN_IN, body),
    signUp: (body: { username: string; password: string }) => http.post<AuthResponse>(URL_SIGN_UP, body)
}