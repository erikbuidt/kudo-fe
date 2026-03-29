import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardApi } from '@/apis/reward.api';
import type { RedeemRewardPayload } from '@/types/reward.type';
import { userKeys } from '@/hooks/useUsers';
import { toast } from 'react-toastify';

export const rewardKeys = {
    all: ['rewards'] as const,
    myRedemptions: ['my-redemptions'] as const,
};

export const useRewards = () => {
    return useQuery({
        queryKey: rewardKeys.all,
        queryFn: async () => {
            const response = await rewardApi.getAllRewards();
            // Assuming data is inside response.data per NestJS default structure or custom interceptor
            if (Array.isArray(response.data)) {
               return response.data;
            }
            return response.data.data;
        },
    });
};

export const useRedeemReward = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ payload, idempotencyKey }: { payload: RedeemRewardPayload; idempotencyKey: string }) =>
            rewardApi.redeemReward(payload, idempotencyKey),
        onSuccess: () => {
            toast.success('Reward redeemed successfully!');
            queryClient.invalidateQueries({ queryKey: rewardKeys.all });
            queryClient.invalidateQueries({ queryKey: rewardKeys.myRedemptions });
            queryClient.invalidateQueries({ queryKey: userKeys.me });
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to redeem reward';
            // Silently ignore idempotency duplicates — the first request already
            // succeeded and its success toast was already shown.
            if (message.includes('already been processed')) return;
            toast.error(message);
        }
    });
};

export const useMyRedemptions = () => {
    return useQuery({
        queryKey: rewardKeys.myRedemptions,
        queryFn: async () => {
            const response = await rewardApi.getMyRedemptions();
            if (Array.isArray(response.data)) {
               return response.data;
            }
            return response.data.data;
        },
    });
};
