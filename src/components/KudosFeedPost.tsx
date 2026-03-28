import { Heart, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Kudo } from '@/types/kudo.type'
import { formatDistanceToNow } from '@/utils/dateUtils'
import { useReactionSummary, useToggleReaction } from '@/hooks/useReactions'
import { cn } from '@/lib/utils'

interface KudosFeedPostProps {
    kudo: Kudo
}

export function KudosFeedPost({ kudo }: KudosFeedPostProps) {
    const { id, sender, receiver, points, created_at, description, core_value, media_url } = kudo;
    const timeAgo = formatDistanceToNow(created_at);

    const { data: summary = [] } = useReactionSummary(id);
    const toggleReaction = useToggleReaction();

    const handleToggle = (emoji: string) => {
        toggleReaction.mutate({ kudo_id: id, emoji });
    };

    const totalReactions = summary.reduce((acc, curr) => acc + curr._count.emoji, 0);

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-6 text-left">
                <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={sender.avatar_url} alt={sender.display_name || sender.username} />
                            <AvatarFallback>{(sender.display_name || sender.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm">
                                <span className="font-bold text-slate-900">{sender.display_name || sender.username}</span>
                                <span className="text-slate-500 mx-1">recognized</span>
                                <span className="font-bold text-slate-900">{receiver.display_name || receiver.username}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{timeAgo}</div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-linear-to-r from-fuchsia-500 to-purple-600 text-white hover:opacity-90 font-bold px-2.5 py-1 rounded-full shrink-0 border-0">
                        +{points} PTS
                    </Badge>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium px-2 py-1 rounded-md border-0 uppercase text-[10px] tracking-wider">
                        #{core_value}
                    </Badge>
                </div>

                {media_url && (
                    <div className="rounded-xl overflow-hidden mb-4 shrink-0 border border-slate-100">
                        <img src={media_url} alt="Recognition attachment" className="w-full h-auto max-h-80 object-cover" />
                    </div>
                )}

                <div className="flex items-center gap-4 mt-6 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggle('❤️')}
                            disabled={toggleReaction.isPending}
                            className={cn(
                                "text-slate-500 hover:text-rose-500 font-semibold gap-2 h-8 px-2 rounded-lg",
                                totalReactions > 0 && "text-rose-500 bg-rose-50/50"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", totalReactions > 0 && "fill-current")} />
                            {totalReactions > 0 && <span className="text-xs">{totalReactions}</span>}
                        </Button>

                        {/* Other emojis summary */}
                        <div className="flex gap-1 ml-1">
                            {summary.map((item) => item.emoji !== '❤️' && (
                                <button
                                    key={item.emoji}
                                    onClick={() => handleToggle(item.emoji)}
                                    className="text-xs bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded-md transition-colors"
                                >
                                    {item.emoji} {item._count.emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-500 font-semibold gap-2 h-8 px-2">
                        <MessageSquare className="w-4 h-4" /> {kudo._count?.comments || 0}
                    </Button>


                    <div className="ml-auto flex -space-x-2">
                        <Avatar className="w-6 h-6 border-2 border-white relative z-20">
                            <AvatarImage src="https://i.pravatar.cc/150?u=a" />
                        </Avatar>
                        <Avatar className="w-6 h-6 border-2 border-white relative z-10">
                            <AvatarImage src="https://i.pravatar.cc/150?u=b" />
                        </Avatar>
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center relative z-0">
                            +10
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
