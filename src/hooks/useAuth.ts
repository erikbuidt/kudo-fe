import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/apis/auth.api';

const useAuth = () => useContext(AuthContext)

const useLogout = () => {
    const { setIsAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            queryClient.clear();
            setIsAuthenticated(false);
        }
    })
}

export { useAuth, useLogout }