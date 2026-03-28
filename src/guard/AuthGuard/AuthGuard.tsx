import { Navigate, useLocation } from 'react-router-dom'
import { path } from '@/routes/path'
import useAuth from '@/hooks/useAuth'

interface Props {
    children?: React.ReactNode
}

export default function AuthGuard({ children }: Props) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()
    return !isAuthenticated ? <Navigate to={path.signIn} state={location.pathname} /> : <>{children}</>
}
