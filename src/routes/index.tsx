import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { path } from './path'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import { AuthGuard, RedirectIfAuthenticated } from '@/guard/AuthGuard/AuthGuard'
const SignIn = lazy(() => import('@/pages/SignIn'))
const SignUp = lazy(() => import('@/pages/SignUp'))
const Home = lazy(() => import('@/pages/Home/Home'))
const RewardCatalog = lazy(() => import('@/pages/RewardCatalog'))
const OAuthCallback = lazy(() => import('@/pages/OAuthCallback'))

export function Routes() {
    return useRoutes([
        {
            path: path.signIn,
            element: (
                <Suspense fallback={<>...</>}>
                    <RedirectIfAuthenticated>
                        <SignIn />
                    </RedirectIfAuthenticated>
                </Suspense>
            )
        },
        {
            path: path.signUp,
            element: (
                <Suspense fallback={<>...</>}>
                    <RedirectIfAuthenticated>
                        <SignUp />
                    </RedirectIfAuthenticated>
                </Suspense>
            )
        },
        {
            path: path.home,
            element: (
                <Suspense fallback={<></>}>
                    <AuthGuard>
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    </AuthGuard>
                </Suspense>
            )
        },
        {
            path: '/reward-catalog',
            element: (
                <Suspense fallback={<></>}>
                    <AuthGuard>
                        <MainLayout>
                            <RewardCatalog />
                        </MainLayout>
                    </AuthGuard>
                </Suspense>
            )
        },
        {
            path: '/auth/callback',
            element: (
                <Suspense fallback={<></>}>
                    <OAuthCallback />
                </Suspense>
            )
        }
    ])
}
