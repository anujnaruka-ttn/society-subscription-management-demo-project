"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Bell, 
    Tag, 
    User, 
    Calendar, 
    Check, 
    CheckCheck, 
    Trash2,
    Phone,
    Mail,
    MapPin
} from "lucide-react";

export type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
    user_id?: string;
    recipient_name?: string;
    recipient_email?: string;
    recipient_phone?: string;
    recipient_role?: string;
};

export const notificationColumns = (
    isAdmin: boolean = false,
    onMarkAsRead?: (notificationId: string) => void,
    onDelete?: (notificationId: string) => void,
    loading?: string | null
): ColumnDef<Notification>[] => [
    {
        id: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{row.getValue("title")}</span>
                {!row.getValue("is_read") && (
                    <Badge variant="default" className="bg-blue-500 text-xs">
                        New
                    </Badge>
                )}
            </div>
        ),
    },
    {
        id: "message",
        header: "Message",
        cell: ({ row }) => (
            <p className="text-sm text-muted-foreground max-w-xs truncate">
                {row.getValue("message")}
            </p>
        ),
    },
    {
        id: "type",
        header: "Type",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const getTypeColor = (type: string) => {
                switch (type) {
                    case 'payment_reminder':
                        return 'bg-orange-100 text-orange-800 border-orange-200';
                    case 'announcement':
                        return 'bg-blue-100 text-blue-800 border-blue-200';
                    case 'system':
                        return 'bg-gray-100 text-gray-800 border-gray-200';
                    default:
                        return 'bg-green-100 text-green-800 border-green-200';
                }
            };

            const getTypeIcon = (type: string) => {
                switch (type) {
                    case 'payment_reminder':
                        return <Tag className="size-3" />;
                    case 'announcement':
                        return <Bell className="size-3" />;
                    case 'system':
                        return <User className="size-3" />;
                    default:
                        return <Bell className="size-3" />;
                }
            };

            return (
                <Badge variant="outline" className={`gap-1 ${getTypeColor(type)}`}>
                    {getTypeIcon(type)}
                    {type.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        id: "created_at",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"));
            return (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>
                        {date.toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
            );
        },
    },
    ...(isAdmin ? [
        {
            id: "recipient_name",
            header: "Recipient",
            cell: ({ row }) => {
                const recipientName = row.getValue("recipient_name") as string;
                const recipientRole = row.getValue("recipient_role") as string;
                const recipientEmail = row.getValue("recipient_email") as string;
                const recipientPhone = row.getValue("recipient_phone") as string;

                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{recipientName || 'Unknown'}</span>
                            <Badge variant="outline" className="text-xs">
                                {recipientRole || 'user'}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                            {recipientEmail && (
                                <div className="flex items-center gap-1">
                                    <Mail className="size-3" />
                                    <span>{recipientEmail}</span>
                                </div>
                            )}
                            {recipientPhone && (
                                <div className="flex items-center gap-1">
                                    <Phone className="size-3" />
                                    <span>{recipientPhone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            },
        }
    ] : []),
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const notification = row.original;
            const isLoading = loading === notification.id;

            return (
                <div className="flex items-center gap-2">
                    {!notification.is_read && onMarkAsRead && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                            disabled={isLoading}
                            className="gap-1"
                        >
                            {isLoading ? (
                                <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <Check className="size-3" />
                            )}
                            Read
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(notification.id)}
                            disabled={isLoading}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            {isLoading ? (
                                <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                                <Trash2 className="size-3" />
                            )}
                        </Button>
                    )}
                </div>
            );
        },
    },
];