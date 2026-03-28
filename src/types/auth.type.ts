import { type SuccessResponseApi } from "./util.type";

export type AuthResponse = SuccessResponseApi<{
    accessToken: string
}>

export interface SignInForm {
    username: string
    password: string
}