import { useState, useCallback } from 'react'
import { Search, Bell, LogOut, Menu, X } from 'lucide-react'
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
import { useLogout } from '@/hooks/useAuth'
import { useContext } from 'react'
import { UserContext } from '@/contexts/UserContext'
import { useSearch } from '@/contexts/SearchContext'

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { searchQuery, setSearchQuery } = useSearch()
    const { data: unreadCount = 0 } = useUnreadCount();
    const { me } = useContext(UserContext)
    const logout = useLogout();

    const handleLogOut = () => {
        logout.mutate();
    }

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    }, [setSearchQuery]);

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden p-0 h-10 w-10 text-slate-600"
                    onClick={onMenuClick}
                >
                    <Menu className="w-6 h-6" />
                </Button>
                <div className="text-indigo-600 font-bold text-lg lg:text-xl tracking-tight leading-none">The Elevated Exchange</div>
            </div>

            <div className="flex-1 max-w-xl px-4 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="AI search recognition..."
                        className="pl-10 pr-9 bg-slate-50 border-none rounded-full focus-visible:ring-1 focus-visible:ring-indigo-100 py-5"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-wider block">GIVING</span>
                    <span className="text-xs lg:text-sm font-medium text-indigo-600 leading-tight">{me?.giving_budget} <span className="hidden xs:inline">pts</span></span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 tracking-wider block">EARNED</span>
                    <span className="text-xs lg:text-sm font-medium text-indigo-600 leading-tight">{me?.received_balance} <span className="hidden xs:inline">pts</span></span>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 lg:px-6 py-4 lg:py-5 text-sm"
                >
                    <span className="hidden xs:inline">Give Kudos</span>
                    <span className="xs:hidden font-bold">+</span>
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
