import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useKudo } from '@/hooks/useKudos';
import { KudosFeedPost } from './KudosFeedPost';
import { Loader2 } from 'lucide-react';

interface KudoDetailModalProps {
    kudoId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function KudoDetailModal({ kudoId, open, onOpenChange }: KudoDetailModalProps) {
    const { data: kudo, isLoading, isError } = useKudo(kudoId || '');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:max-w-xl p-0 overflow-hidden border-none bg-transparent shadow-none">
                <DialogTitle className="sr-only">Kudo Detail</DialogTitle>
                <div className="bg-white rounded-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="text-sm text-slate-500 font-medium">Loading recognition details...</p>
                        </div>
                    ) : isError ? (
                        <div className="p-20 text-center">
                            <p className="text-rose-500 font-medium font-sm">Failed to load kudo details.</p>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="mt-4 text-xs text-slate-400 hover:text-slate-600 underline"
                            >
                                Close modal
                            </button>
                        </div>
                    ) : kudo ? (
                        <KudosFeedPost kudo={kudo} defaultShowComments={true} />
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
