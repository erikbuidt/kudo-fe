import { http } from "../utils/http";
import { type GetFeedResponse, type CreateKudoPayload, type Kudo } from "../types/kudo.type";
import type { SuccessResponseApi } from "../types/util.type";

export const kudoApi = {
    getFeed: (params: { page?: number; limit?: number }) => {
        return http.get<SuccessResponseApi<GetFeedResponse>>('kudos/feed', { params });
    },
    createKudo: (payload: CreateKudoPayload) => {
        return http.post<SuccessResponseApi<Kudo>>('kudos', payload);
    },
    getKudo: (id: string) => {
        return http.get<SuccessResponseApi<Kudo>>(`kudos/${id}`);
    },
    getTopValues: () => {
        return http.get<SuccessResponseApi<{ core_value: string, count: number }[]>>('kudos/top-values');
    }
}
