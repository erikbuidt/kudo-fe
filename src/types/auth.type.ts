import { type SuccessResponseApi } from "./util.type";

export type AuthResponse = SuccessResponseApi<{
    access_token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}>

export interface SignInForm {
    email: string
    password: string
}

export interface SignUpForm {
    username: string
    display_name?: string
    email: string
    password: string
}