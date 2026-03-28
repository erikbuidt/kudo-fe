import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRewards, useRedeemReward, useMyRedemptions } from '@/hooks/useRewards'
import { useMe } from '@/hooks/useUsers'
import { Loader2 } from 'lucide-react'
import type { Reward, Redemption } from '@/types/reward.type'


export default function RewardCatalog() {
    const [view, setView] = useState<'catalog' | 'my-redemptions'>('catalog')
    const { data: user, isLoading: isLoadingUser } = useMe()
    const { data: rewards = [], isLoading: isLoadingRewards } = useRewards()
    const { data: myRedemptions = [], isLoading: isLoadingRedemptions } = useMyRedemptions()

    const availablePoints = user?.received_balance || 0;

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Reward Catalog</h1>
                    <p className="text-slate-500">Redeem your hard-earned points for exclusive company swag, unique experiences, or some well-deserved time off.</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider">AVAILABLE POINTS</span>
                        <span className="text-xl font-bold text-indigo-600">
                            {isLoadingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : availablePoints.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl w-fit mb-6">
                <button
                    onClick={() => setView('catalog')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${view === 'catalog' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Catalog
                </button>
                <button
                    onClick={() => setView('my-redemptions')}
                    className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${view === 'my-redemptions' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    My Redemptions
                </button>
            </div>

            {view === 'catalog' ? (
                <>
                    <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-px">
                        {['All Rewards'].map((category, i) => (
                            <button
                                key={category}
                                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${i === 0 ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-800'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Grid of items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isLoadingRewards ? (
                            <div className="col-span-full flex justify-center py-20 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        ) : rewards.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-slate-500">
                                No rewards available at the moment.
                            </div>
                        ) : (
                            rewards.map((reward: Reward) => (
                                <RewardItem
                                    key={reward.id}
                                    reward={reward}
                                    userBalance={availablePoints}
                                />
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingRedemptions ? (
                        <div className="col-span-full flex justify-center py-20 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : myRedemptions.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-slate-500">
                            You haven't redeemed any rewards yet.
                        </div>
                    ) : (
                        myRedemptions.map((redemption: Redemption) => (
                            <RedeemedItem key={redemption.id} redemption={redemption} />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

function RedeemedItem({ redemption }: { redemption: Redemption }) {
    const reward = redemption.reward;
    const imageUrl = reward.image_url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2600&auto=format&fit=crop";

    return (
        <Card className="rounded-2xl overflow-hidden shadow-sm flex flex-col border-slate-200 text-left opacity-90 hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-100 shrink-0 relative grayscale-[20%]">
                <Badge className="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide border-0">Redeemed</Badge>
                <img src={imageUrl} alt={reward.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col pt-4">
                <h3 className="font-bold text-slate-900 leading-tight mb-1">{reward.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{reward.point_cost.toLocaleString()} Pts</p>
                <div className="mt-auto px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Redeemed On</p>
                    <p className="text-sm font-medium text-slate-700">{new Date(redemption.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function RewardItem({ reward, userBalance }: { reward: Reward, userBalance: number }) {
    const { mutate: redeem, isPending } = useRedeemReward();
    const canAfford = userBalance >= reward.point_cost;
    const isOutOfStock = reward.stock <= 0;

    // Use the actual backend image_url, or fallback to a placeholder if it's missing somehow
    const imageUrl = reward.image_url || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2600&auto=format&fit=crop";

    return (
        <Card className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col border-slate-200 text-left py-0 s">
            <div className="h-40 bg-slate-100 shrink-0 relative">
                {reward.stock < 5 && reward.stock > 0 && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide border-0">Only {reward.stock} left!</Badge>
                )}
                <img src={imageUrl} alt={reward.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col pt-4">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-slate-900 leading-tight">{reward.name}</h3>
                    <Badge variant="secondary" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold shrink-0 rounded-md">
                        {reward.point_cost.toLocaleString()} Pts
                    </Badge>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-6">{reward.description}</p>
                <Button
                    disabled={!canAfford || isOutOfStock || isPending}
                    onClick={() => redeem({ reward_id: reward.id })}
                    className="mt-auto w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold disabled:opacity-50"
                    variant="secondary"
                >
                    {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isOutOfStock ? (
                        'Out of Stock'
                    ) : !canAfford ? (
                        'Not Enough Points'
                    ) : (
                        'Redeem'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
