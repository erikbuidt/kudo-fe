import { useQuery } from '@tanstack/react-query';
import { userApi } from '../apis/user.api';

export const userKeys = {
    all: ['users'] as const,
    me: ['me'] as const,
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
    });
};