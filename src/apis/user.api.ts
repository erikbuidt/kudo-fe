import { http } from "../utils/http";
import { type KudoUser } from "../types/kudo.type";
import type { SuccessResponseApi } from "../types/util.type";

export const userApi = {
    getAllUsers: () => {
        return http.get<SuccessResponseApi<KudoUser[]>>('users');
    },
    getMe: () => {
        return http.get<SuccessResponseApi<KudoUser>>('users/me');
    }
}
