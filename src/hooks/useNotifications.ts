import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../apis/notification.api';

export const notificationKeys = {
    all: ['notifications'] as const,
    lists: () => [...notificationKeys.all, 'list'] as const,
    unreadCount: () => [...notificationKeys.all, 'unread'] as const,
};

export const useNotifications = () => {
    return useInfiniteQuery({
        queryKey: notificationKeys.lists(),
        queryFn: async ({ pageParam }) => {
            const response = await notificationApi.getNotifications({ page: pageParam as number | undefined });
            return response.data.data;
        },
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage) => lastPage.meta.total_pages > lastPage.meta.current_page ? lastPage.meta.current_page + 1 : undefined,

    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: notificationKeys.unreadCount(),
        queryFn: async () => {
            const { data } = await notificationApi.getUnreadCount();
            return data.data;
        },
        refetchInterval: 30000,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
};
