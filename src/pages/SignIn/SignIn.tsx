import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authApi } from '@/apis/auth.api'
import { AuthContext } from '@/contexts/AuthContext'
import { path } from '@/routes/path'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { config } from '@/constants/config'

const signInSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

type SignInFormData = z.infer<typeof signInSchema>


function SignIn() {
    const navigate = useNavigate()
    const { setIsAuthenticated } = useContext(AuthContext)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const { mutate: login, isPending } = useMutation({
        mutationFn: (data: SignInFormData) => authApi.signIn(data),
        onSuccess: () => {
            setIsAuthenticated(true)
            navigate(path.home)
        },
    })

    const onSubmit = (data: SignInFormData) => {
        login(data)
    }


    const handleLoginWithGoogle = () => {
        window.location.href = `${config.BASE_URL}/auth/google`
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden items-center justify-center p-12">
                {/* Decorative circles */}
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-white/5" />
                <div className="absolute bottom-[-120px] right-[-60px] w-[500px] h-[500px] rounded-full bg-white/5" />
                <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] rounded-full bg-white/5" />

                <div className="relative z-10 max-w-md text-white">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Kudo</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-5">
                        Elevate your team's culture
                    </h1>
                    <p className="text-indigo-200 text-lg leading-relaxed">
                        Recognize brilliance, celebrate wins, and build a workplace where people feel valued every single day.
                    </p>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                        {[
                            { label: 'Kudos Sent', value: '12k+' },
                            { label: 'Teams Active', value: '800+' },
                            { label: 'Happiness Score', value: '98%' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-indigo-200 text-xs mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-indigo-600">Kudo</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                            <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    className={`h-11 ${errors.email ? 'border-rose-400 focus-visible:ring-rose-200' : 'border-slate-200'}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>


                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                        className={`h-11 pr-10 ${errors.password ? 'border-rose-400 focus-visible:ring-rose-200' : 'border-slate-200'}`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        onClick={() => setShowPassword(p => !p)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>
                                )}
                            </div>


                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in...
                                    </span>
                                ) : 'Sign in'}
                            </Button>
                            {/* Login by google */}
                            <Button
                                onClick={handleLoginWithGoogle}
                                type="button"
                                className="w-full h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2.5"
                            >
                                <IconBrandGoogleFilled className="w-4 h-4 text-[#4285F4]" />
                                Sign in with Google
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <Link
                                    to={path.signUp}
                                    className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors"
                                >
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn