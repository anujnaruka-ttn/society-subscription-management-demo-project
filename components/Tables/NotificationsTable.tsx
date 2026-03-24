"use client";

import { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CommonTable } from "./Common/CommonTable";
import { notificationColumns, type Notification } from "./User/Columns/NotificationColumns";

type NotificationsTableProps = {
    notifications: Notification[];
    isAdmin?: boolean;
    onMarkAsRead?: (notificationId: string) => void;
    onMarkAllAsRead?: () => void;
    onDelete?: (notificationId: string) => void;
    loading?: boolean;
};

const NotificationsTable = ({ 
    notifications, 
    isAdmin = false,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    loading = false
}: NotificationsTableProps) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const columns = useMemo(
        () => notificationColumns(isAdmin, onMarkAsRead, onDelete, actionLoading),
        [isAdmin, onMarkAsRead, onDelete, actionLoading]
    );

    const table = useReactTable({
        data: notifications,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        globalFilterFn: "includesString",
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const actionButton = isAdmin && unreadCount > 0 && onMarkAllAsRead ? (
        <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllAsRead}
            className="gap-2"
        >
            <CheckCheck className="size-4" />
            Mark All Read
        </Button>
    ) : null;

    const refreshButton = (
        <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2"
        >
            <RefreshCw className="size-4" />
            Refresh
        </Button>
    );

    return (
        <Card className="w-full h-full p-3">
            <CardHeader className="border-b border-border p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="size-5" />
                            {isAdmin ? 'All Notifications' : 'My Notifications'}
                        </CardTitle>
                        <CardDescription>
                            {unreadCount > 0 && (
                                <span className="text-orange-600 font-medium">
                                    {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                                </span>
                            )}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {actionButton}
                        {refreshButton}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3">
                <CommonTable
                    table={table}
                    loading={loading}
                    columnsCount={columns.length}
                    searchPlaceholder="Search notifications..."
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    actionButton={null}
                    className="border-none shadow-none"
                    tableContainerClassName="h-[500px]"
                />
            </CardContent>
        </Card>
    );
};

export default NotificationsTable;