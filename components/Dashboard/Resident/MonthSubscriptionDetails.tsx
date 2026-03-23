"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/store";
import { getResidentSubscriptionsByMonth } from "@/lib/residentApis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CommonBadge from "@/components/common/CommonBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, IndianRupee, Calendar, Home, Users } from "lucide-react";
import { ResidentBillingRecord } from "@/types/ResidentBillingRecord";

interface MonthSubscriptionDetailsProps {
    month: string;
}

export default function MonthSubscriptionDetails({ month }: MonthSubscriptionDetailsProps) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    
    const { records, loading } = useSelector((state: RootState) => state.residentSubscriptionBilling);
    
    useEffect(() => {
        if (month) dispatch(getResidentSubscriptionsByMonth(month));
    }, [dispatch, month]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "default";
            case "pending":
                return "secondary";
            case "overdue":
                return "destructive";
            case "cancelled":
                return "outline";
            default:
                return "default";
        }
    };

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    };

    return (
        <div className="w-full h-full overflow-y-auto p-6 space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/subscriptions')}
                    className="flex items-center gap-2 hover:text-primary"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Subscription Details</h1>
                    <p className="text-muted-foreground">{formatMonth(month)}</p>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="w-full flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Subscription Records */}
            {!loading && records && records.length > 0 && (
                <div className="w-full space-y-4">
                    {records.map((record: ResidentBillingRecord) => (
                        <Card key={record.id} className="w-full">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Home className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{record.flat_address}</span>
                                            <Badge variant="outline">{record.flat_type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Due: {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {record.residents.length} resident(s)
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusColor(record.status)}>
                                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Amount Display - Similar to SubscriptionClient styling */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Amount Due</label>
                                    <div className='relative flex items-center h-12 bg-background rounded-lg border border-border/50'>
                                        <div className="pl-3 pr-2 text-muted-foreground">
                                            <IndianRupee className="size-4" />
                                        </div>
                                        <div className="text-lg font-medium text-foreground">
                                            {record.amount_due.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>

                                {/* Residents */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Residents</label>
                                    <CommonBadge items={record.residents} variant="secondary" />
                                </div>

                                {/* Payment Details (if paid) */}
                                {record.status === 'paid' && record.payment_date && (
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Amount Paid</label>
                                            <div className="flex items-center gap-1 mt-1">
                                                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">{record.amount_paid?.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                                            <p className="font-medium">{new Date(record.payment_date).toLocaleDateString()}</p>
                                        </div>
                                        {record.payment_mode && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Payment Mode</label>
                                                <p className="font-medium">{record.payment_mode}</p>
                                            </div>
                                        )}
                                        {record.transaction_id && (
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                                                <p className="font-medium text-sm">{record.transaction_id}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && (!records || records.length === 0) && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-muted-foreground text-center">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No subscription records found</h3>
                            <p>No subscription data available for {formatMonth(month)}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
