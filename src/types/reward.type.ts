export interface Reward {
    id: string;
    name: string;
    description: string;
    point_cost: number;
    stock: number;
    image_url?: string;
}

export interface RedeemRewardPayload {
    reward_id: string;
}

export interface Redemption {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    user_id: string;
    reward_id: string;
    created_at: string;
    reward: Reward;
}
