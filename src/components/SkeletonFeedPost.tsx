export default function SkeletonFeedPost() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-pulse min-h-[320px] flex flex-col gap-5">
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                    <div className="flex flex-col gap-2 w-full">
                        <div className="h-4 bg-slate-200 rounded w-2/5"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/5"></div>
                    </div>
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
            </div>
            
            <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-11/12"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
            </div>

            <div className="flex gap-2">
                <div className="h-6 w-24 bg-slate-100 rounded-md"></div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                <div className="flex gap-4">
                    <div className="h-8 w-12 bg-slate-100 rounded-lg"></div>
                    <div className="h-8 w-12 bg-slate-100 rounded-lg"></div>
                </div>
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white"></div>
                </div>
            </div>
        </div>
    );
}