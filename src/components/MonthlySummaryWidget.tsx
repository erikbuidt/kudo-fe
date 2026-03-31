import { Sparkles, Loader2 } from 'lucide-react';
import { useMonthlySummary } from '@/hooks/useUsers';

export function MonthlySummaryWidget() {
    const { data, isLoading, isError } = useMonthlySummary();

    return (
        <div className="bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-5 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Your Month in Review
                </h3>
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span className="text-xs text-slate-400">Generating your summary...</span>
                </div>
            ) : isError ? (
                <p className="text-xs text-slate-400 italic">Your AI summary is unavailable. Check your Gemini API key.</p>
            ) : (
                <>
                    <p className="text-sm text-slate-700 leading-relaxed">{data?.summary}</p>
                    {(data?.kudos_count ?? 0) > 0 && (
                        <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center gap-1.5">
                            <span className="text-lg">🎉</span>
                            <span className="text-xs font-semibold text-indigo-600">
                                {data?.kudos_count} Kudo{data?.kudos_count !== 1 ? 's' : ''} received this month
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
