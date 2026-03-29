import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/apis/comment.api';
import type { CreateCommentPayload } from '@/types/comment.type';

export const commentKeys = {
    list: (kudoId: string) => ['comments', kudoId] as const,
};

export const useComments = (kudoId: string) => {
    return useQuery({
        queryKey: commentKeys.list(kudoId),
        queryFn: async () => {
            const res = await commentApi.getComments(kudoId);
            return Array.isArray(res.data) ? res.data : res.data.data;
        },
        enabled: Boolean(kudoId),
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCommentPayload) => commentApi.addComment(payload),
        onSuccess: (_, variables) => {
            // Refresh comments list for this specific kudo
            queryClient.invalidateQueries({ queryKey: commentKeys.list(variables.kudo_id) });
            // Refresh feed so comment count updates
            queryClient.invalidateQueries({ queryKey: ['kudos'] });
        },
    });
};
