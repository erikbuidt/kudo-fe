import { useEffect, useContext, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '@/contexts/AuthContext'
import { path } from '@/routes/path'
import { Loader2, Sparkles } from 'lucide-react'

function OAuthCallback() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { setIsAuthenticated } = useContext(AuthContext)
    const handled = useRef(false)

    useEffect(() => {
        if (handled.current) return
        handled.current = true

        const token = searchParams.get('access_token')

        if (token) {
            localStorage.setItem('accessToken', token)
            setIsAuthenticated(true)
            navigate(path.home, { replace: true })
        } else {
            navigate(path.signIn, { replace: true })
        }
    }, [navigate, searchParams, setIsAuthenticated])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                Signing you in with Google...
            </div>
        </div>
    )
}

export default OAuthCallback
