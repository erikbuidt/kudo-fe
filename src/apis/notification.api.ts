import { http } from "../utils/http";
import { type GetNotificationsResponse } from "../types/notification.type";
import type { SuccessResponseApi } from "../types/util.type";

export const notificationApi = {
    getNotifications: (params: { limit?: number; page?: number }) => {
        return http.get<SuccessResponseApi<GetNotificationsResponse>>('notifications', { params });
    },
    getUnreadCount: () => {
        return http.get<SuccessResponseApi<number>>('notifications/unread-count');
    },
    markAsRead: (id: string) => {
        return http.patch<SuccessResponseApi<void>>(`notifications/${id}/read`, {});
    }
}
