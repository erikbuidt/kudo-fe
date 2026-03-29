import { useNotifications, useMarkAsRead } from '../hooks/useNotifications';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useState } from 'react';
import { KudoDetailModal } from './KudoDetailModal';

import { Check, BellRing } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { formatDistanceToNow } from '@/utils/dateUtils';

export function NotificationFeed() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useNotifications();
    const { mutate: markAsRead } = useMarkAsRead();

    const [selectedKudoId, setSelectedKudoId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadMoreRef = useIntersectionObserver({
        onIntersect: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        enabled: hasNextPage && !isFetchingNextPage,
    });

    if (isLoading) {
        return <div className="p-4 text-center text-slate-500 text-sm">Loading notifications...</div>;
    }

    if (isError) {
        return <div className="p-4 text-center text-rose-500 text-sm">Failed to load notifications.</div>;
    }

    const notifications = data?.pages.flatMap(page => page.data) || [];

    const handleNotificationClick = (notification: any) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }

        if (notification.kudo_id) {
            setSelectedKudoId(notification.kudo_id);
            setIsModalOpen(true);
        }
    };

    if (notifications.length === 0) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <BellRing className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1">When you get kudos or comments, they'll show up here.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={cn(
                            "p-4 border-b border-slate-100 transition-colors last:border-b-0 cursor-pointer hover:bg-slate-50 flex gap-3",
                            !notification.is_read ? "bg-indigo-50/50" : "bg-white"
                        )}
                    >
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-sm text-slate-800 leading-snug">
                                {notification.message}
                            </p>
                            {notification.kudo && (
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                        {notification.kudo.points} pts
                                    </span>
                                    <span className="text-xs text-slate-500 truncate max-w-[150px]">
                                        {notification.kudo.description}
                                    </span>
                                </div>
                            )}
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">
                                {formatDistanceToNow(new Date(notification.created_at))} ago
                            </p>
                        </div>

                        {!notification.is_read && (
                            <div className="shrink-0 flex items-start pt-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-6 h-6 rounded-full text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                    }}
                                    title="Mark as read"
                                >
                                    <Check className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Loading indicator / Intersection target for infinite scroll */}
                <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center pt-2 pb-4"
                >
                    {isFetchingNextPage && <span className="text-xs text-slate-400">Loading more...</span>}
                    {!hasNextPage && notifications.length > 0 && (
                        <span className="text-xs text-slate-400">You've reached the end</span>
                    )}
                </div>
            </div>

            <KudoDetailModal
                kudoId={selectedKudoId}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
}
