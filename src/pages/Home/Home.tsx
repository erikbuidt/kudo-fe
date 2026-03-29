import { Loader2 } from 'lucide-react'
import { KudosFeedPost } from '@/components/KudosFeedPost'
import { useKudos, useTopCoreValues } from '@/hooks/useKudos'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { GiveKudoModal } from '@/components/GiveKudoModal'
import { useState, useLayoutEffect, useRef } from 'react'
import SkeletonFeedPost from '@/components/SkeletonFeedPost'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMe } from '@/hooks/useUsers'

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const scrollPosRef = useRef(0);
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useKudos();

    const { data: user } = useMe();

    const { data: topValues, isLoading: isLoadingTopValues } = useTopCoreValues();

    const kudos = data?.pages.flatMap(page => page.data) || [];

    // Force scroll position to stay still when new items are added
    useLayoutEffect(() => {
        if (kudos.length > 0) {
            window.scrollTo(0, scrollPosRef.current);
        }
    }, [kudos.length]);

    const handleScroll = () => {
        scrollPosRef.current = window.scrollY;
    };

    useLayoutEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const loadMoreRef = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        rootMargin: '600px',
        threshold: 0
    });

    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* Main Feed Column */}
            <div className="flex-1 w-full lg:max-w-2xl flex flex-col gap-4 lg:gap-6" style={{ overflowAnchor: 'none' }}>

                {/* Compose Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex gap-3 items-center">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={user?.avatar_url} alt={user?.display_name} />
                            <AvatarFallback className="text-[10px]">
                                {(user?.display_name || user?.username || '').substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="text"
                            placeholder="Give a Kudo to someone..."
                            className="bg-slate-50 border-none rounded-full w-full py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-100 cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                            readOnly
                        />
                    </div>
                    <div className="flex justify-end pl-13">

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Give Recognition
                        </button>
                    </div>
                </div>

                {/* Feed Posts */}
                <div className="flex flex-col gap-6 pb-20">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                            <p className="text-slate-500 font-medium">Crunching kudos...</p>
                        </div>
                    ) : isError ? (
                        <div className="py-20 text-center text-slate-500 font-medium">
                            Failed to load feed. Refresh to try again.
                        </div>
                    ) : kudos.length === 0 ? (
                        <div className="py-20 text-center text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
                            No recognition yet. Be the first to give a Kudo!
                        </div>
                    ) : (
                        <>
                            {kudos.map(kudo => (
                                <KudosFeedPost key={kudo.id} kudo={kudo} />
                            ))}
                            {/* Loading / Pagination Zone */}
                            <div className="w-full flex flex-col gap-6 py-4">
                                {isFetchingNextPage && (
                                    <>
                                        <SkeletonFeedPost />
                                    </>
                                )}
                                <div ref={loadMoreRef} className="h-1 pointer-events-none" />
                            </div>
                        </>
                    )}
                </div>
            </div>

            <GiveKudoModal isOpen={isModalOpen} onClose={setIsModalOpen} />

            {/* Right Sidebar WidgetPs */}
            <div className="w-72 hidden lg:flex flex-col gap-6 shrink-0 sticky top-28">

                {/* Top Values Widget */}
                <div className="bg-white border text-left border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Top Values This Week</h3>
                    <div className="flex flex-col gap-3">
                        {isLoadingTopValues ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                            </div>
                        ) : topValues?.length === 0 ? (
                            <div className="text-center text-xs text-slate-500 py-2">No kudos given this week</div>
                        ) : (
                            topValues?.map((item) => {
                                const emojiMap: Record<string, string> = {
                                    TEAMWORK: '🤝',
                                    OWNERSHIP: '👑',
                                    INNOVATION: '💡',
                                    CUSTOMER_FIRST: '⭐',
                                };
                                const labelMap: Record<string, string> = {
                                    TEAMWORK: 'Teamwork',
                                    OWNERSHIP: 'Ownership',
                                    INNOVATION: 'Innovation',
                                    CUSTOMER_FIRST: 'Customer First',
                                };
                                return (
                                    <div key={item.core_value} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-slate-700 font-medium">
                                            <span className="text-lg">{emojiMap[item.core_value] || '✨'}</span> {labelMap[item.core_value] || item.core_value}
                                        </div>
                                        <span className="font-bold text-slate-900">{item.count}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
