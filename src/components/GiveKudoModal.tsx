import { useState, useMemo, useEffect, useRef } from 'react'
import { Image as ImageIcon, Sparkles, X, Check, Loader2, Search, Film, Trash2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useUsers } from '@/hooks/useUsers'
import { useCreateKudo } from '@/hooks/useKudos'
import { useUploadMedia } from '@/hooks/useUploadMedia'
import { type CoreValue, type KudoUser } from '@/types/kudo.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'


const kudoSchema = z.object({
    receiver_id: z.string().min(1, 'Please select a colleague'),
    points: z.number().min(10).max(50),
    description: z.string().min(10, 'Please provide a bit more detail (min 10 chars)').max(500),
    core_value: z.enum(['TEAMWORK', 'OWNERSHIP', 'INNOVATION', 'CUSTOMER_FIRST'], {
        message: 'Please select a core value',
    }),
    media_url: z.string().optional(),
    media_type: z.enum(['IMAGE', 'VIDEO']).optional(),
})

type KudoFormData = z.infer<typeof kudoSchema>

interface GiveKudoModalProps {
    isOpen: boolean
    onClose: (isOpen: boolean) => void
}

const CORE_VALUES: { label: string; value: CoreValue }[] = [
    { label: 'Teamwork', value: 'TEAMWORK' },
    { label: 'Innovation', value: 'INNOVATION' },
    { label: 'Ownership', value: 'OWNERSHIP' },
    { label: 'Customer First', value: 'CUSTOMER_FIRST' },
]


export function GiveKudoModal({ isOpen, onClose }: GiveKudoModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUser, setSelectedUser] = useState<KudoUser | null>(null)
    const [isUserListOpen, setIsUserListOpen] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const { data: users = [], isLoading: isLoadingUsers } = useUsers()
    const { mutateAsync: createKudo, isPending: isCreating } = useCreateKudo()
    const { mutateAsync: uploadMedia, isPending: isUploading } = useUploadMedia()



    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<KudoFormData>({
        resolver: zodResolver(kudoSchema),
        defaultValues: {
            points: 25,
            description: '',
        },
        mode: 'onChange'
    })




    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset();
            setSelectedUser(null);
            setSearchQuery('');
            setSelectedFile(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    }, [isOpen, reset, previewUrl]);



    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        return users.filter(u =>
            (u.display_name || u.username).toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const onSubmit = async (data: KudoFormData) => {
        try {
            let finalData = { ...data };

            // If there's a file but it hasn't been uploaded yet
            if (selectedFile) {
                const uploadResult = await uploadMedia(selectedFile);
                finalData.media_url = uploadResult.media_url;
                finalData.media_type = uploadResult.media_type;
            }

            await createKudo(finalData);
            onClose(false);
        } catch (error) {
            // Error is handled by hooks
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Revoke old preview if exists
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setValue('media_type', file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO', { shouldValidate: true });
    };

    const removeAttachment = () => {
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setValue('media_url', undefined);
        setValue('media_type', undefined);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };




    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] md:max-w-[600px] p-0 overflow-hidden border-0 rounded-3xl shadow-2xl">
                <DialogHeader className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <DialogTitle className="text-xl font-bold text-slate-900">Give Recognition</DialogTitle>
                    <DialogDescription>Celebrate your colleagues' achievements</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="p-6 flex flex-col gap-8">
                            {/* User Selection */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-900 mb-2.5">Who do you want to recognize?</label>
                                <Controller
                                    name="receiver_id"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            {selectedUser ? (
                                                <div className={cn(
                                                    "flex items-center justify-between p-3 bg-indigo-50 border rounded-xl transition-colors",
                                                    errors.receiver_id ? "border-rose-300" : "border-indigo-100"
                                                )}>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={selectedUser.avatar_url} />
                                                            <AvatarFallback>{(selectedUser.display_name || selectedUser.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-bold text-indigo-900 text-sm">
                                                            {selectedUser.display_name || selectedUser.username}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedUser(null);
                                                            field.onChange('');
                                                        }}
                                                        className="p-1 hover:bg-indigo-100 rounded-full text-indigo-400 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <Search className={cn(
                                                        "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                                        errors.receiver_id ? "text-rose-400" : "text-slate-400"
                                                    )} />
                                                    <Input
                                                        placeholder="Type name or username..."
                                                        className={cn(
                                                            "bg-slate-50 pl-10 h-11 rounded-xl focus-visible:ring-indigo-200",
                                                            errors.receiver_id ? "border-rose-400" : "border-slate-200"
                                                        )}
                                                        value={searchQuery}
                                                        onFocus={() => setIsUserListOpen(true)}
                                                        onBlur={() => setIsUserListOpen(false)}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                    {errors.receiver_id && (
                                                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-1.5 ml-1">{errors.receiver_id.message}</p>
                                                    )}
                                                    {isUserListOpen && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                                            {isLoadingUsers ? (
                                                                <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-300" /></div>
                                                            ) : filteredUsers.length === 0 ? (
                                                                <div className="p-4 text-center text-sm text-slate-400">No colleagues found</div>
                                                            ) : (
                                                                filteredUsers.map(user => (
                                                                    <button
                                                                        type="button"
                                                                        key={user.id}
                                                                        onMouseDown={(e) => {
                                                                            // Prevent onBlur from firing before selection
                                                                            e.preventDefault();
                                                                            setSelectedUser(user);
                                                                            field.onChange(user.id);
                                                                            setIsUserListOpen(false);
                                                                            setSearchQuery('');
                                                                        }}
                                                                        className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                                                                    >
                                                                        <Avatar className="w-8 h-8">
                                                                            <AvatarImage src={user.avatar_url} />
                                                                            <AvatarFallback>{(user.display_name || user.username).substring(0, 2).toUpperCase()}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div>
                                                                            <div className="text-sm font-bold text-slate-900">{user.display_name || user.username}</div>
                                                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">@{user.username}</div>
                                                                        </div>
                                                                    </button>
                                                                ))
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Points Slider */}
                            <div>
                                <Controller
                                    name="points"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <div className="flex justify-between items-end mb-4">
                                                <label className="block text-sm font-semibold text-slate-900 font-urbanist tracking-tight">How many points?</label>
                                                <span className="text-4xl font-black text-indigo-600 font-urbanist tracking-tighter">{field.value}</span>
                                            </div>
                                            <Slider
                                                value={[field.value]}
                                                onValueChange={(val) => field.onChange(val[0])}
                                                max={50}
                                                min={10}
                                                step={5}
                                                className="cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">
                                                <span>Min 10</span>
                                                <span>Max 50</span>
                                            </div>
                                        </>
                                    )}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2.5">What did they do?</label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Textarea
                                                {...field}
                                                placeholder="Share specific details about their impact. What made this moment stand out?"
                                                className={cn(
                                                    "bg-slate-50 resize-none rounded-xl p-4 focus-visible:ring-indigo-200 min-h-[100px] transition-colors",
                                                    errors.description ? "border-rose-400" : "border-slate-200"
                                                )}
                                                rows={3}
                                            />
                                            {errors.description && (
                                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-1.5 ml-1">{errors.description.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>

                            {/* Core Values */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-3.5">Add Core Values</label>
                                <Controller
                                    name="core_value"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-wrap gap-2.5">
                                                {CORE_VALUES.map((val) => (
                                                    <button
                                                        type="button"
                                                        key={val.value}
                                                        onClick={() => field.onChange(val.value)}
                                                        className={cn(
                                                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all border shrink-0",
                                                            field.value === val.value
                                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-105"
                                                                : cn("bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600", errors.core_value ? "border-rose-300" : "border-slate-200")
                                                        )}
                                                    >
                                                        {field.value === val.value && <Check className="w-3 h-3" />}
                                                        #{val.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.core_value && (
                                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider mt-1.5 ml-1">{errors.core_value.message}</p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Attachment Preview */}
                            {(previewUrl || isUploading) && (
                                <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-video flex items-center justify-center border-2 border-slate-200 border-dashed">
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Uploading...</span>
                                        </div>
                                    ) : selectedFile?.type.startsWith('image/') ? (
                                        <img src={previewUrl!} alt="Attachment" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-indigo-600">
                                            <Film className="w-12 h-12" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Video Selected</span>
                                        </div>
                                    )}



                                    {!isUploading && (
                                        <button
                                            type="button"
                                            onClick={removeAttachment}
                                            className="absolute top-3 right-3 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg transition-all active:scale-95 z-30"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="text-slate-500 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest gap-2 hover:bg-white rounded-xl"
                            >
                                <ImageIcon className="w-4 h-4" />
                                {previewUrl ? 'Change' : 'Attach'}
                            </Button>
                        </div>
                        <Button
                            disabled={!isValid || isCreating || isUploading}
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl flex items-center gap-2.5 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isCreating || isUploading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Send Recognition
                        </Button>
                    </div>

                </form>

            </DialogContent>
        </Dialog>
    )
}
