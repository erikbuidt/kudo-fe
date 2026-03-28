import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { path } from './path'
import MainLayout from '@/layouts/MainLayout/MainLayout'
const SignIn = lazy(() => import('@/pages/SignIn'))
const SignUp = lazy(() => import('@/pages/SignUp'))
const Home = lazy(() => import('@/pages/Home'))
export function Routes() {
    return useRoutes([
        {
            path: path.signIn,
            element: (
                <Suspense fallback={<>...</>}>
                    <SignIn />
                </Suspense>
            )
        },
        {
            path: path.signUp,
            element: (
                <Suspense fallback={<>...</>}>
                    <SignUp />
                </Suspense>
            )
        },
        {
            path: path.home,
            element: (
                <Suspense fallback={<>...</>}>
                    <MainLayout>
                        <Home />
                    </MainLayout>
                </Suspense>
            )
        }
    ])
}
