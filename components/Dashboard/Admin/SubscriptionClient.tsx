'use client'

import { PlusCircle, Edit2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions } from '@/lib/subscriptionApis';

const SubscriptionClient = () => {

    const { subscriptions } = useSelector((state: any) => state.adminSubscription);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubscriptions() as any);
    }, []);

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
                <Button
                    className='bg-primary gap-2 shadow-sm hover:shadow-md transition-all w-fit px-3'
                    size={"icon-lg"}
                    variant="outline"
                >
                    <PlusCircle className="size-4" />
                    Add Subscription
                </Button>
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
                                    <div
                                        className='border-none shadow-none focus:outline-none focus:ring-0 text-lg font-medium w-full h-full flex items-center-safe p-0 bg-transparent text-muted-foreground'
                                    >
                                        {item.monthly_rate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className='bg-primary w-fit px-3 text-primary-foreground gap-2'
                            size={"icon-lg"}
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
