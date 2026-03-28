import { useState } from 'react'
import { Search, Bell, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { GiveKudoModal } from './GiveKudoModal'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"
import { NotificationFeed } from './NotificationFeed'
import { useUnreadCount } from '../hooks/useNotifications'
import { useMe } from '../hooks/useUsers'
import { authApi } from '@/apis/auth.api'
import { useQueryClient } from '@tanstack/react-query'
import { useLogout } from '@/hooks/useAuth'

export function Topbar() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data: user } = useMe();
    const logout = useLogout();

    const handleLogOut = () => {
        logout.mutate();
    }

    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="text-indigo-600 font-bold text-xl tracking-tight">The Elevated Exchange</div>
            </div>

            <div className="flex-1 max-w-xl px-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search recognition..."
                        className="pl-10 bg-slate-50 border-none rounded-full focus-visible:ring-1 focus-visible:ring-indigo-100 py-5"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">POINTS BUDGET</span>
                    <span className="text-sm font-medium text-indigo-600">{user?.giving_budget} pts</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider">POINTS RECEIVED</span>
                    <span className="text-sm font-medium text-indigo-600">{user?.received_balance} pts</span>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-5"
                >
                    Give Kudos
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <button className="relative text-slate-500 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center -translate-y-1/4 translate-x-1/4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                                </span>
                            )}
                        </button>
                    </PopoverTrigger>
                    {/* TODO: Add logout button */}
                    <Button size="icon" onClick={handleLogOut}>
                        <LogOut />
                    </Button>
                    <PopoverContent className="w-80 p-0 mr-4 mt-2 shadow-xl border-slate-100" align="end">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-lg">
                            <h3 className="font-semibold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        <NotificationFeed />
                    </PopoverContent>
                </Popover>
            </div>

            <GiveKudoModal isOpen={isModalOpen} onClose={setIsModalOpen} />
        </header >
    )
}
