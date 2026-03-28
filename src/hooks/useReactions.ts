import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reactionApi, type ToggleReactionPayload } from '@/apis/reaction.api';

export const reactionKeys = {
    all: ['reactions'] as const,
    summary: (kudoId: string) => [...reactionKeys.all, 'summary', kudoId] as const,
};

export const useReactionSummary = (kudoId: string) => {
    return useQuery({
        queryKey: reactionKeys.summary(kudoId),
        queryFn: async () => {
            const response = await reactionApi.getSummary(kudoId);
            return response.data.data;
        },
        enabled: !!kudoId,
    });
};

export const useToggleReaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ToggleReactionPayload) => reactionApi.toggleReaction(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reactionKeys.summary(variables.kudo_id) });
        },
    });
};
