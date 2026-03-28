export type NotificationType = 'KUDO_RECEIVED' | 'COMMENT_ON_KUDO' | 'REACTION_ON_KUDO';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  is_read: boolean;
  kudo_id?: string;
  created_at: string;
  updated_at: string;
  kudo?: {
    id: string;
    points: number;
    description: string;
  };
}

export interface GetNotificationsResponse {
  data: Notification[];
  meta: {
    total_items: number;
    items_per_page: number;
    current_page: number;
    total_pages: number;
    item_count: number;
  };
}
