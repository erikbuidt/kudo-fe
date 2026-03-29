export type CoreValue = 'TEAMWORK' | 'OWNERSHIP' | 'INNOVATION' | 'CUSTOMER_FIRST';
export type MediaType = 'IMAGE' | 'VIDEO';

export interface KudoUser {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  giving_budget: number;
  received_balance: number;
}

export interface Kudo {
  id: string;
  sender_id: string;
  receiver_id: string;
  points: number;
  description: string;
  core_value: CoreValue;
  media_url?: string;
  media_type?: MediaType;
  created_at: string;
  sender: KudoUser;
  receiver: KudoUser;
  comments_count?: number;
  reactions_count?: number;
}

export interface CreateKudoPayload {
  receiver_id: string;
  points: number;
  description: string;
  core_value: CoreValue;
  media_url?: string;
  media_type?: MediaType;
}

export interface GetFeedResponse {
  data: Kudo[];
  meta: {
    total_items: number;
    items_per_page: number;
    current_page: number;
    total_pages: number;
    item_count: number;
  };
}
