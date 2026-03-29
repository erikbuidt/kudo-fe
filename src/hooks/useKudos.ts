import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { kudoApi } from '../apis/kudo.api';
import { type CreateKudoPayload } from '../types/kudo.type';
import { toast } from 'react-toastify';
import { userKeys } from './useUsers';

export const kudoKeys = {
    all: ['kudos'] as const,
    feed: () => [...kudoKeys.all, 'feed'] as const,
    detail: (id: string) => [...kudoKeys.all, 'detail', id] as const,
    topValues: () => [...kudoKeys.all, 'top-values'] as const,
};

export const useKudo = (id: string) => {
    return useQuery({
        queryKey: kudoKeys.detail(id),
        queryFn: async () => {
            const response = await kudoApi.getKudo(id);
            return response.data.data;
        },
        enabled: !!id,
    });
};

export const useKudos = () => {
    return useInfiniteQuery({
        queryKey: kudoKeys.feed(),
        queryFn: async ({ pageParam }) => {
            const response = await kudoApi.getFeed({ page: pageParam as number });
            return response.data.data;
        },
        initialPageParam: 1 as number,
        getNextPageParam: (lastPage) =>
            lastPage.meta.total_pages > lastPage.meta.current_page
                ? lastPage.meta.current_page + 1
                : undefined,
    });
};

export const useCreateKudo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateKudoPayload) => kudoApi.createKudo(payload),
        onSuccess: () => {
            toast.success('Kudo sent successfully! 🎉');
            queryClient.invalidateQueries({ queryKey: kudoKeys.feed() });
            queryClient.invalidateQueries({ queryKey: userKeys.me });

        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Failed to send kudo';
            toast.error(message);
        }
    });
};

export const useTopCoreValues = () => {
    return useQuery({
        queryKey: kudoKeys.topValues(),
        queryFn: async () => {
            const response = await kudoApi.getTopValues();
            return response.data.data;
        }
    });
};
