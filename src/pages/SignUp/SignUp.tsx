import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { authApi } from '@/apis/auth.api'
import { path } from '@/routes/path'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-toastify'

const signUpSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    display_name: z.string().optional(),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type SignUpFormData = z.infer<typeof signUpSchema>


function SignUp() {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            display_name: '',
            email: '',
            password: '',
        }
    })

    const { mutate: registerUser, isPending } = useMutation({
        mutationFn: (data: SignUpFormData) => authApi.signUp({
            username: data.username,
            display_name: data.display_name || undefined,
            email: data.email,
            password: data.password,
        }),
        onSuccess: () => {
            toast.success('Account created! Please sign in.')
            navigate(path.signIn)
        },
    })

    const onSubmit = (data: SignUpFormData) => {
        registerUser(data)
    }


    const perks = [
        'Send recognition & kudos to teammates',
        'Earn reward points for great work',
        'Real-time notification feed',
        'Browse and redeem exclusive rewards',
    ]

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-violet-600 via-indigo-600 to-blue-700 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-white/5" />
                <div className="absolute bottom-[-120px] right-[-60px] w-[500px] h-[500px] rounded-full bg-white/5" />

                <div className="relative z-10 max-w-md text-white">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Kudo</span>
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-5">
                        Join a culture of recognition
                    </h1>
                    <p className="text-indigo-200 text-lg leading-relaxed mb-10">
                        Be part of a team that celebrates each other. Create your free account and start recognizing great work today.
                    </p>

                    <ul className="space-y-3">
                        {perks.map(perk => (
                            <li key={perk} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                                <span className="text-indigo-100 text-sm">{perk}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md py-8">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-indigo-600">Kudo</span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
                            <p className="text-slate-500 mt-1 text-sm">Free forever for team recognition</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                                        Username <span className="text-rose-400">*</span>
                                    </Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        autoComplete="username"
                                        placeholder="john_doe"
                                        {...register('username')}
                                        className={`h-11 ${errors.username ? 'border-rose-400 focus-visible:ring-rose-200' : 'border-slate-200'}`}
                                    />
                                    {errors.username && (
                                        <p className="text-xs text-rose-500">{errors.username.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="display_name" className="text-sm font-medium text-slate-700">
                                        Display Name
                                    </Label>
                                    <Input
                                        id="display_name"
                                        type="text"
                                        placeholder="John Doe"
                                        {...register('display_name')}
                                        className="h-11 border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                    Email address <span className="text-rose-400">*</span>
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
                                    <p className="text-xs text-rose-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password <span className="text-rose-400">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        placeholder="Min. 6 characters"
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
                                    <p className="text-xs text-rose-500">{errors.password.message}</p>
                                )}
                            </div>


                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70 mt-2"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating account...
                                    </span>
                                ) : 'Create account'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link
                                    to={path.signIn}
                                    className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp