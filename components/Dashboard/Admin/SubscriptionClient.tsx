'use client'

import { PlusCircle, Edit2, IndianRupee, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions, updateMonthlyRate } from '@/lib/subscriptionApis';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const SubscriptionClient = () => {

    const { subscriptions } = useSelector((state: any) => state.adminSubscription);

    // Per-item toggle state: { [id]: true (disabled) | false (enabled) }
    const [toggleDisableMonthlyRateInput, setToggleDisableMonthlyRateInput] = useState<Record<string, boolean>>({});

    // Per-item editable rate state: { [id]: rate_value }
    const [monthlyRates, setMonthlyRates] = useState<Record<string, string | number>>({});

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubscriptions() as any);
    }, []);

    // When subscriptions load, initialize the local rate state from Redux data
    useEffect(() => {
        if (subscriptions?.length) {
            const initialRates: Record<string, string | number> = {};
            subscriptions.forEach((item: any) => {
                initialRates[item.id] = item.monthly_rate;
            });
            setMonthlyRates(initialRates);
        }
    }, [subscriptions]);

    const handleMonthlyRateUpdate = (subscription_id: string) => {
        setToggleDisableMonthlyRateInput(prev => ({
            ...prev,
            // If undefined (first click), default was disabled=true, so flip to false (enabled)
            [subscription_id]: !prev[subscription_id]
        }))
    }

    const handleMonthlyRateInput = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        setMonthlyRates(prev => ({
            ...prev,
            [id]: e.target.value
        }));
    }

    const handleKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newRate = Number(monthlyRates[id]);
            if (isNaN(newRate) || newRate <= 0) {
                toast.error('Please enter a valid monthly rate');
                return;
            }
            // Find the flat_type for this subscription (backend requires flat_type, not id)
            const flat_type = subscriptions.find((s: any) => s.id === id)?.flat_type;
            if (!flat_type) {
                toast.error('Could not find subscription details');
                return;
            }
            dispatch(updateMonthlyRate(id, newRate, flat_type) as any);
            // Re-disable the input after saving
            setToggleDisableMonthlyRateInput(prev => ({ ...prev, [id]: true }));
            toast.success('Monthly rate updated successfully');
        }
        if (e.key === 'Escape') {
            // Cancel edit: restore original value and re-disable
            const original = subscriptions.find((s: any) => s.id === id)?.monthly_rate;
            setMonthlyRates(prev => ({ ...prev, [id]: original }));
            setToggleDisableMonthlyRateInput(prev => ({ ...prev, [id]: true }));
        }
    }

    return (
        <Card className='w-full h-full bg-transparent border-none shadow-none p-6'>
            <CardHeader className='w-full px-0 pt-0 pb-8 flex flex-row justify-between items-center'>
                <div className='flex flex-col gap-1.5'>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Manage Subscription
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Configure monthly subscription rates based on flat configuration
                    </CardDescription>
                </div>
                <Tooltip>
                    {/* Wrap in span — disabled buttons swallow pointer events so tooltip never fires otherwise */}
                    <TooltipTrigger asChild>
                        <span className="cursor-not-allowed">
                            <Button
                                className='bg-primary gap-2 text-white shadow-sm transition-all w-fit px-3 pointer-events-none'
                                size={"icon-lg"}
                                variant="ghost"
                                disabled
                                tabIndex={-1}
                            >
                                <PlusCircle className="size-4" />
                                Add Subscription
                            </Button>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-52 text-center text-xs leading-relaxed">
                        <p>
                            No new flat type configurations are currently proposed for this society.
                            New subscription plans can only be added when a new flat type is introduced.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </CardHeader>
            <CardContent className='p-0 flex flex-col gap-4'>
                {subscriptions.map((item: any) => (
                    <Card
                        key={item.id}
                        className='group flex flex-row w-full h-fit items-center justify-between gap-4 p-4 border-border/50 hover:border-primary/50 hover:bg-muted/5 transition-all duration-300'
                    >
                        <div className='flex items-center gap-6 flex-1'>
                            {/* Flat Type Box */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Flat Type</span>
                                <div className='w-full min-w-25 h-12 px-4 flex items-center justify-center bg-muted rounded-lg border border-border/50 font-bold text-lg shadow-inner'>
                                    {item.flat_type}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-16 w-px bg-border/60 mx-2 hidden sm:block" />

                            {/* Rate Input Section */}
                            <div className="flex flex-col gap-1 flex-1 max-w-60">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Monthly Rate</span>
                                <div className='relative flex items-center h-12 bg-background rounded-lg border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all'>
                                    <div className="pl-3 pr-2 text-muted-foreground">
                                        <IndianRupee className="size-4" />
                                    </div>
                                    <input
                                        className='border-none shadow-none focus:outline-none focus:ring-0 text-lg font-medium w-full h-full p-0 bg-transparent text-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed'
                                        // Use per-item local editable rate; fall back to redux value
                                        value={monthlyRates[item.id] ?? item.monthly_rate}
                                        disabled={toggleDisableMonthlyRateInput[item.id] !== false}
                                        onChange={(e) => handleMonthlyRateInput(item.id, e)}
                                        onKeyDown={(e) => handleKeyDown(item.id, e)}
                                        placeholder="Enter rate & press Enter"
                                        type="text"
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-16 w-px bg-border/60 mx-2 hidden sm:block" />

                            {/* Effective From Section */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">Effective From</span>
                                <div className="flex items-center gap-2 h-12 px-4 bg-muted/50 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground">
                                    <Calendar className="size-4 shrink-0 text-primary/70" />
                                    {item.effective_from
                                        ? new Date(item.effective_from).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })
                                        : '—'
                                    }
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className='bg-primary w-fit px-3 text-white gap-2'
                            size={"icon-lg"}
                            onClick={() => handleMonthlyRateUpdate(item.id)}
                        >
                            <Edit2 className="size-4" />
                            Update Rate
                        </Button>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}

export default SubscriptionClient;
