import { useState, useRef } from 'react'
import { Heart, MessageSquare, Image, X, Send, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Kudo, type MediaType } from '@/types/kudo.type'
import { formatDistanceToNow } from '@/utils/dateUtils'
import { useReactionSummary, useToggleReaction } from '@/hooks/useReactions'
import { useComments, useAddComment } from '@/hooks/useComments'
import { useUploadMedia } from '@/hooks/useUploadMedia'
import { cn } from '@/lib/utils'
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth'

interface KudosFeedPostProps {
    kudo: Kudo;
    defaultShowComments?: boolean;
}

export function KudosFeedPost({ kudo, defaultShowComments = false }: KudosFeedPostProps) {
    const { id, sender, receiver, points, created_at, description, core_value, media_url } = kudo;
    const timeAgo = formatDistanceToNow(created_at);

    // Reactions
    const { data: summary = [] } = useReactionSummary(id);
    const toggleReaction = useToggleReaction();
    const handleToggle = (emoji: string) => toggleReaction.mutate({ kudo_id: id, emoji });
    const totalReactions = summary.reduce((acc, curr) => acc + curr._count.emoji, 0);

    // Comments
    const [showComments, setShowComments] = useState(defaultShowComments);
    const { data: comments = [], isLoading: isLoadingComments } = useComments(showComments ? id : '');
    const { mutate: addComment, isPending: isSubmitting } = useAddComment();
    const { me } = useAuth()
    // Comment form state
    const [text, setText] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedMediaType, setSelectedMediaType] = useState<MediaType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadMedia = useUploadMedia();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setSelectedMediaType(file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE');
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearMedia = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        setSelectedMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() && !selectedFile) return;

        let mediaUrl = null;

        try {
            if (selectedFile) {
                const result = await uploadMedia.mutateAsync(selectedFile);
                mediaUrl = result.media_url;
            }

            addComment(
                {
                    kudo_id: id,
                    content: text.trim(),
                    ...(mediaUrl ? { media_url: mediaUrl, media_type: selectedMediaType || 'IMAGE' } : {})
                },
                {
                    onSuccess: () => {
                        setText('');
                        clearMedia();
                    },
                }
            );
        } catch (error) {
            console.error('Failed to upload media:', error);
            toast.error('Failed to upload attachment. Please try again.');
        }
    };

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow transition-shadow min-h-[200px]">
            <CardContent className="p-4 lg:p-6 text-left">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 gap-2 lg:gap-4">
                    <div className="flex gap-2 lg:gap-3">
                        <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                            <AvatarImage src={sender.avatar_url} alt={sender.display_name || sender.username} />
                            <AvatarFallback>{(sender.display_name || sender.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <div className="text-xs lg:text-sm leading-tight lg:leading-normal">
                                <span className="font-bold text-slate-900 truncate">{me?.id === sender.id ? 'You' : sender.display_name || sender.username}</span>
                                <span className="text-slate-500 mx-1">recognized</span>
                                <span className="font-bold text-slate-900 truncate">{me?.id === receiver.id ? 'You' : receiver.display_name || receiver.username}</span>
                            </div>
                            <div className="text-[10px] lg:text-xs text-slate-400 mt-0.5">{timeAgo}</div>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-linear-to-r from-fuchsia-500 to-purple-600 text-white hover:opacity-90 font-bold px-2 py-0.5 lg:px-2.5 lg:py-1 rounded-full shrink-0 border-0 text-[10px] lg:text-xs">
                        +{points} PTS
                    </Badge>
                </div>

                {/* Body */}
                <p className="text-slate-700 text-xs lg:text-sm leading-relaxed mb-4 whitespace-pre-wrap">{description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium px-2 py-1 rounded-md border-0 uppercase text-[10px] tracking-wider">
                        #{core_value}
                    </Badge>
                </div>

                {media_url && (
                    <div className="rounded-xl overflow-hidden mb-4 shrink-0 border border-slate-100">
                        {kudo.media_type === 'VIDEO' ? (
                            <video
                                src={media_url}
                                controls
                                className="w-full h-auto max-h-60 lg:max-h-80 object-cover"
                            />
                        ) : (
                            <img src={media_url} alt="Recognition attachment" className="w-full h-auto max-h-60 lg:max-h-80 object-cover" />
                        )}
                    </div>
                )}

                {/* Action bar */}
                <div className="flex items-center gap-4 mt-6 border-t border-slate-100 pt-4">
                    {/* Reactions */}
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggle('❤️')}
                            disabled={toggleReaction.isPending}
                            className={cn(
                                "text-slate-500 hover:text-rose-500 font-semibold gap-2 h-8 px-2 rounded-lg",
                                kudo.is_reacted && "text-rose-500 bg-rose-50/50"
                            )}
                        >
                            <Heart className={cn("w-4 h-4", kudo.is_reacted && "fill-current")} />
                            {totalReactions > 0 && <span className="text-xs">{totalReactions}</span>}
                        </Button>

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

                    {/* Comment toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowComments(v => !v)}
                        className={cn(
                            "text-slate-500 hover:text-indigo-500 font-semibold gap-2 h-8 px-2 rounded-lg",
                            showComments && "text-indigo-600 bg-indigo-50"
                        )}
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-xs">
                            {showComments && comments.length > 0
                                ? comments.length
                                : (kudo.comments_count ?? 0)}
                        </span>
                    </Button>
                </div>

                {/* Inline comment panel */}
                {showComments && (
                    <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">

                        {/* Comment list */}
                        {isLoadingComments ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                            </div>
                        ) : comments.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-2">No comments yet. Be the first!</p>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex gap-2.5">
                                        <Avatar className="w-7 h-7 shrink-0 mt-0.5">
                                            <AvatarImage src={comment.user.avatar_url} />
                                            <AvatarFallback className="text-[10px]">
                                                {(comment.user.display_name || comment.user.username).substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-slate-50 rounded-xl px-3 py-2 text-sm border border-slate-100">
                                                <span className="font-semibold text-slate-800 mr-1.5 text-xs">
                                                    {comment.user.display_name || comment.user.username}
                                                </span>
                                                <span className="text-slate-600 wrap-break-word">{comment.content}</span>
                                            </div>
                                            {comment.media_url && (
                                                <div className="mt-1.5 rounded-lg overflow-hidden border border-slate-100 max-w-xs">
                                                    {comment.media_type === 'VIDEO' ? (
                                                        <video
                                                            src={comment.media_url}
                                                            controls
                                                            className="w-full h-auto object-cover"
                                                        />
                                                    ) : (
                                                        <img src={comment.media_url} alt="Comment attachment" className="w-full h-auto object-cover" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="text-[10px] text-slate-400 mt-1 ml-1">
                                                {formatDistanceToNow(comment.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Comment composer */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">


                            <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7 shrink-0">
                                    <AvatarImage src={me?.avatar_url} />
                                    <AvatarFallback className="text-[10px]">
                                        {(me?.display_name || me?.username || 'Me').substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        placeholder="Write a comment…"
                                        className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400 min-w-0"
                                    />

                                    {/* Image attach button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadMedia.isPending}
                                        className="text-slate-400 hover:text-indigo-500 transition-colors p-0.5 shrink-0"
                                    >
                                        <Image className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={(!text.trim() && !selectedFile) || isSubmitting || uploadMedia.isPending}
                                    className="rounded-full w-8 h-8 p-0 bg-indigo-600 hover:bg-indigo-700 shrink-0"
                                >
                                    {isSubmitting || uploadMedia.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                </Button>
                            </div>
                            {/* Image preview */}
                            {previewUrl && (
                                <div className="relative w-fit ml-9">
                                    {selectedMediaType === 'VIDEO' ? (
                                        <video
                                            src={previewUrl}
                                            className="h-20 w-auto rounded-lg object-cover border border-slate-200"
                                            muted
                                        />
                                    ) : (
                                        <img src={previewUrl} alt="Preview" className="h-20 rounded-lg object-cover border border-slate-200" />
                                    )}
                                    <button
                                        type="button"
                                        onClick={clearMedia}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    {uploadMedia.isPending && (
                                        <div className="absolute inset-0 bg-white/60 rounded-lg flex items-center justify-center">
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
