import { Link, useLocation } from 'react-router-dom'
import { Home, Gift } from 'lucide-react'
import { path } from '@/routes/path'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useContext } from 'react'
import { UserContext } from '@/contexts/UserContext'

export function Sidebar({ className }: { className?: string }) {
    const location = useLocation()
    const { me } = useContext(UserContext)

    const NAV_ITEMS = [
        { name: 'Feed', icon: Home, path: path.home },
        { name: 'Rewards', icon: Gift, path: '/reward-catalog' },
    ]

    return (
        <aside className={cn("w-64 fixed flex flex-col pt-10 px-4  lg:flex", className)}>
            {/* User Profile Summary */}
            <div className="flex items-center gap-3 mb-10 px-4">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={me?.avatar_url} alt={me?.display_name} />
                    <AvatarFallback className="text-[10px]">
                        {(me?.display_name || me?.username || '').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-sm">{me?.display_name}</h3>
                    <p className="text-xs text-slate-500">{me?.username}</p>
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
