import { useQuery } from '@tanstack/react-query';
import { userApi } from '../apis/user.api';

export const userKeys = {
    all: ['users'] as const,
    me: ['me'] as const,
    monthlySummary: ['me', 'monthly-summary'] as const,
};

export const useUsers = () => {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: async () => {
            const response = await userApi.getAllUsers();
            return response.data.data;
        },
    });
};

export const useMe = () => {
    return useQuery({
        queryKey: userKeys.me,
        queryFn: async () => {
            const response = await userApi.getMe();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!localStorage.getItem('accessToken'),
    });
};

export const useMonthlySummary = () => {
    return useQuery({
        queryKey: userKeys.monthlySummary,
        queryFn: async () => {
            const response = await userApi.getMonthlySummary();
            return response.data.data;
        },
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        retry: false,
        enabled: !!localStorage.getItem('accessToken'),
    });
};
