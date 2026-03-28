import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/apis/auth.api';

const useAuth = () => useContext(AuthContext)

const useLogout = () => {
    const { setIsAuthenticated } = useAuth();
    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            setIsAuthenticated(false);
            window.localStorage.removeItem('accessToken');

        }
    })
}

export { useAuth, useLogout }