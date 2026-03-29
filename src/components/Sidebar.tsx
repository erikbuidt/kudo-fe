import { Link, useLocation } from 'react-router-dom'
import { Home, Gift, User } from 'lucide-react'
import { path } from '@/routes/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMe } from '@/hooks/useUsers';
import { cn } from '@/lib/utils'

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation()
    const { data: user } = useMe();

    const NAV_ITEMS = [
        { name: 'Feed', icon: Home, path: path.home },
        { name: 'Rewards', icon: Gift, path: '/reward-catalog' },
    ]

    return (
        <aside className={cn("w-64 flex flex-col pt-10 px-4 hidden lg:flex", className)}>
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 mb-10 px-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=1" alt="Alex Rivers" />
                    <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-sm">{user?.display_name}</h3>
                    <p className="text-xs text-slate-500">Senior Designer</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === path.home && location.pathname === '/')
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
