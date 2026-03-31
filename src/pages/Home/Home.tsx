import { Loader2, Sparkles, Search } from 'lucide-react'
import { KudosFeedPost } from '@/components/KudosFeedPost'
import { useKudos, useTopCoreValues, useSearchKudos } from '@/hooks/useKudos'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { GiveKudoModal } from '@/components/GiveKudoModal'
import { useState, useLayoutEffect, useRef, useContext } from 'react'
import SkeletonFeedPost from '@/components/SkeletonFeedPost'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserContext } from '@/contexts/UserContext'
import { useSearch } from '@/contexts/SearchContext'
import { MonthlySummaryWidget } from '@/components/MonthlySummaryWidget'


export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const scrollPosRef = useRef(0);
    const { searchQuery } = useSearch();
    const isSearchActive = searchQuery.trim().length > 2;

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useKudos();

    const {
        data: searchResults,
        isLoading: isSearching,
        isFetching: isSearchFetching,
    } = useSearchKudos(searchQuery);

    const { me } = useContext(UserContext)
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
                            <AvatarImage src={me?.avatar_url} alt={me?.display_name} />
                            <AvatarFallback className="text-[10px]">
                                {(me?.display_name || me?.username || '').substring(0, 2).toUpperCase()}
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

                {/* --- SEARCH RESULTS MODE --- */}
                {isSearchActive ? (
                    <div className="flex flex-col gap-6 pb-20">
                        {/* Search Header */}
                        <div className="flex items-center gap-2 px-1">
                            <div className="flex items-center gap-1.5 text-indigo-600">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">AI Search</span>
                            </div>
                            <span className="text-slate-400 text-sm">—</span>
                            <span className="text-sm text-slate-600 italic truncate">"{searchQuery}"</span>
                            {(isSearching || isSearchFetching) && (
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500 ml-auto" />
                            )}
                        </div>

                        {isSearching ? (
                            <>
                                <SkeletonFeedPost />
                                <SkeletonFeedPost />
                            </>
                        ) : searchResults?.length === 0 ? (
                            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Search className="w-8 h-8 text-slate-300" />
                                <p className="font-medium">No matching Kudos found</p>
                                <p className="text-sm text-slate-400">Try a different search phrase</p>
                            </div>
                        ) : (
                            searchResults?.map(kudo => (
                                <KudosFeedPost key={kudo.id} kudo={kudo} />
                            ))
                        )}
                    </div>
                ) : (
                    /* --- NORMAL FEED MODE --- */
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
                )}
            </div>

            <GiveKudoModal isOpen={isModalOpen} onClose={setIsModalOpen} />

            {/* Right Sidebar Widgets */}
            <div className="w-72 hidden lg:flex flex-col gap-6 shrink-0 sticky top-28">

                {/* Monthly AI Summary Widget */}
                <MonthlySummaryWidget />

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
