import { http } from '@/utils/http';
import type { SuccessResponseApi } from '@/types/util.type';
import type { Reward, RedeemRewardPayload, Redemption } from '@/types/reward.type';

export const rewardApi = {
    getAllRewards: () => {
        return http.get<SuccessResponseApi<Reward[]>>('rewards');
    },
    redeemReward: (payload: RedeemRewardPayload, idempotencyKey: string) => {
        return http.post<SuccessResponseApi<Redemption>>('rewards/redeem', payload, {
            headers: { 'X-Idempotency-Key': idempotencyKey },
        });
    },
    getMyRedemptions: () => {
        return http.get<SuccessResponseApi<Redemption[]>>('rewards/redemptions/me');
    }
};
