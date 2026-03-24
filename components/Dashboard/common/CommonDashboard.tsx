export const revalidate = 3600;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartAreaInteractive } from "../Charts/ChartAreaInteractive";
import MoneyCollectedChart from "../Charts/MoneyCollectedChart";
import { MonthFlatsChart } from "../Charts/MonthFlatChart";
import PendingPaymentsTable from "@/components/Tables/Admin/PendingPayments";
import NotificationsTable from "@/components/Tables/NotificationsTable";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, CreditCard, Home, Phone, Mail, MapPin } from "lucide-react";

type CommonDashboardProps = {
    role: "admin" | "user";
    dashboardData?: {
        monthlyStats: any[];
        monthlyFlatsStats: any[];
        moneyCollectedStats: any[];
    };
}

const CommonDashboard = (
    {
        props
    }: {
        props: CommonDashboardProps
    }) => {
    const { dashboardData, role } = props;
    
    // Admin Layout - Original dashboard
    if (role === "admin") {
        return (
            <Card className="w-full h-full mx-auto flex flex-row justify-center gap-3 border-none shadow-none bg-transparent rounded-t-none">
                {/* left side */}
                <Card className="w-[70%] h-full p-6">
                    <CardContent className="px-0 h-full flex flex-col gap-y-3">
                        <ChartAreaInteractive data={dashboardData?.monthlyStats || []} />
                        <MonthFlatsChart data={dashboardData?.monthlyFlatsStats || []} />
                    </CardContent>
                </Card>

                {/* right side */}
                <Card className="w-[25%] h-full">
                    {/* money collected */}
                    <Card className="h-[40%] bg-transparent border-none shadow-none py-1.5">
                        <CardHeader className="border-b border-border">
                            <CardTitle>
                                Money Collected
                            </CardTitle>
                            <CardDescription>
                                Showing money collected
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-3">
                            <MoneyCollectedChart data={dashboardData?.moneyCollectedStats || []} />
                        </CardContent>
                    </Card>

                    <Card className="h-[60%] bg-transparent border-none shadow-none py-1.5 gap-0 overflow-hidden">
                        <CardHeader className="border-b border-border flex-1">
                            <CardTitle>
                                Pending Payment
                            </CardTitle>
                            <CardDescription>
                                Showing pending payment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-1.5 h-[85%]">
                            <PendingPaymentsTable />
                        </CardContent>
                    </Card>
                </Card>
            </Card>
        );
    }
    
    // Resident Layout - New design with notifications
    return (
        <Card className="w-full h-full mx-auto flex flex-row justify-center gap-3 border-none shadow-none bg-transparent rounded-t-none">
            {/* Left side - Resident Details and Subscription */}
            <div className="w-[50%] h-full flex flex-col gap-3">
                {/* Resident Details */}
                <Card className="flex-1">
                    <CardHeader className="border-b border-border">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Resident Details
                        </CardTitle>
                        <CardDescription>
                            Your personal information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        {/* Mock resident data - Replace with actual user data */}
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Users className="size-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">John Doe</h3>
                                <Badge variant="outline" className="gap-1">
                                    <Home className="size-3" />
                                    Resident
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <Mail className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Email</p>
                                    <p className="text-sm font-medium">john.doe@example.com</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <Phone className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <p className="text-sm font-medium">+91 98765 43210</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <MapPin className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Flat</p>
                                    <p className="text-sm font-medium">Floor 2, Flat 201</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Details */}
                <Card className="flex-1">
                    <CardHeader className="border-b border-border">
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="size-5" />
                            Subscription Details
                        </CardTitle>
                        <CardDescription>
                            Your current subscription status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monthly Rate</p>
                                        <p className="text-sm font-semibold">₹5,000</p>
                                    </div>
                                </div>
                                <Badge variant="default" className="bg-green-500">
                                    Active
                                </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Last Payment</p>
                                        <p className="text-sm font-medium">March 1, 2026</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                    Paid
                                </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Next Due</p>
                                        <p className="text-sm font-medium">April 1, 2026</p>
                                    </div>
                                </div>
                                <Badge variant="outline">
                                    Upcoming
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right side - Notifications */}
            <div className="w-[50%] h-full">
                <NotificationsTable 
                    notifications={[]} // Pass actual notifications data
                    isAdmin={false}
                />
            </div>
        </Card>
    );
}

export default CommonDashboard;