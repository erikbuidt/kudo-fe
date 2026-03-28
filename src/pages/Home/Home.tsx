import { Filter, Image as ImageIcon, Paperclip, Smile, Loader2 } from 'lucide-react'
import { KudosFeedPost } from '@/components/KudosFeedPost'
import { useKudos, useTopCoreValues } from '@/hooks/useKudos'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { GiveKudoModal } from '@/components/GiveKudoModal'
import { useState } from 'react'
import SkeletonFeedPost from '@/components/SkeletonFeedPost'

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useKudos();

    const { data: topValues, isLoading: isLoadingTopValues } = useTopCoreValues();


    const loadMoreRef = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        rootMargin: '600px',
        threshold: 0
    });

    const kudos = data?.pages.flatMap(page => page.data) || [];

    return (
        <div className="max-w-5xl mx-auto flex gap-8 items-start">
            {/* Main Feed Column */}
            <div className="flex-1 w-full max-w-2xl flex flex-col gap-6" style={{ overflowAnchor: 'none' }}>

                {/* Compose Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
                    <div className="flex gap-3 items-center">
                        <img src="https://i.pravatar.cc/150?u=1" className="w-10 h-10 rounded-full shrink-0" alt="Me" />
                        <input
                            type="text"
                            placeholder="Give a Kudo to someone..."
                            className="bg-slate-50 border-none rounded-full w-full py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-100 cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                            readOnly
                        />
                    </div>
                    <div className="flex items-center justify-between pl-13">
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50"><ImageIcon className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50"><Paperclip className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-slate-50"><Smile className="w-4 h-4" /></button>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
                        >
                            Give Recognition
                        </button>
                    </div>
                </div>

                {/* Feed Header */}
                <div className="flex items-center justify-between mt-2">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Live Recognition Feed</h2>
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        <Filter className="w-4 h-4" />
                        Sort: Recent
                    </button>
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
                            <div className="w-full flex flex-col gap-6">
                                {isFetchingNextPage && (<>
                                    <SkeletonFeedPost />
                                    <SkeletonFeedPost />
                                </>)}
                                <div ref={loadMoreRef} className="h-4 pointer-events-none" style={{ overflowAnchor: 'none' }} />
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

                {/* New Rewards Widget */}
                <div className="bg-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden text-left">
                    {/* Decorative abstract shape */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>

                    <h3 className="font-bold text-lg leading-tight mb-2 relative z-10">New Rewards Available!</h3>
                    <p className="text-indigo-100 text-xs mb-5 relative z-10 leading-relaxed">
                        You have enough points to redeem the "Day Off Pass".
                    </p>
                    <button className="w-full bg-white text-indigo-700 text-xs font-bold tracking-wide uppercase py-2.5 rounded-lg hover:bg-slate-50 transition-colors relative z-10 shadow-sm">
                        Browse Rewards
                    </button>
                </div>

            </div>
        </div>
    )
}
