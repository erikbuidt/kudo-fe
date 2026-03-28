import { http } from '@/utils/http';
import { type SuccessResponseApi } from '@/types/util.type';

export interface ReactionSummary {
    emoji: string;
    _count: {
        emoji: number;
    };
}

export interface ToggleReactionPayload {
    kudo_id: string;
    emoji: string;
}

export const reactionApi = {
    toggleReaction: (payload: ToggleReactionPayload) => {
        return http.post<SuccessResponseApi<{ action: 'added' | 'removed'; emoji: string }>>('reactions/toggle', payload);
    },
    getSummary: (kudoId: string) => {
        return http.get<SuccessResponseApi<ReactionSummary[]>>('reactions/summary', {
            params: { kudo_id: kudoId }
        });
    }
};
