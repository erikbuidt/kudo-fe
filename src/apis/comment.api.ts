import { http } from '@/utils/http';
import type { SuccessResponseApi } from '@/types/util.type';
import type { Comment, CreateCommentPayload } from '@/types/comment.type';

export const commentApi = {
    getComments: (kudoId: string) => {
        return http.get<SuccessResponseApi<Comment[]>>('comments', { params: { kudo_id: kudoId } });
    },
    addComment: (payload: CreateCommentPayload) => {
        return http.post<SuccessResponseApi<Comment>>('comments', payload);
    },
};
