import { Navigate, useLocation } from 'react-router-dom'
import { path } from '@/routes/path'
import { useAuth } from '@/hooks/useAuth'

interface Props {
    children?: React.ReactNode
}

export const AuthGuard = ({ children }: Props) => {
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    return !isAuthenticated ? <Navigate to={path.signIn} state={location.pathname} /> : <>{children}</>
}

export const RedirectIfAuthenticated = ({ children }: Props) => {
    const { isAuthenticated } = useAuth()
    console.log(isAuthenticated)
    const location = useLocation()
    return isAuthenticated ? <Navigate to={path.home} state={location.pathname} /> : <>{children}</>
}
