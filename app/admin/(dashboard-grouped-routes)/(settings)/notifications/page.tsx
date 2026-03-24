"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
    Bell, 
    Send, 
    Filter, 
    Search
} from "lucide-react";
import NotificationsTable from "@/components/Tables/NotificationsTable";
import type { Notification } from "@/components/Tables/User/Columns/NotificationColumns";
import { apiConnector } from "@/lib/apiConnector";
import { apiMethods, apis, BASE_URL } from "@/lib/apis";
import { useSelector } from "react-redux";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSendForm, setShowSendForm] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all',
        unread_only: false,
        user_id: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: 'system',
        user_ids: [] as string[]
    });

    const token = useSelector((state: any) => state.auth.token);

    // Fetch notifications and users on component mount
    useEffect(() => {
        fetchNotifications();
        fetchUsers();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: BASE_URL + '/notifications/all',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data?.success) {
                setNotifications(response.data.data || []);
            } else {
                toast.error('Failed to fetch notifications');
            }
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            // Fallback to mock data if API fails
            const mockNotifications: Notification[] = [
                {
                    id: '1',
                    user_id: 'user1',
                    title: 'Payment Reminder',
                    message: 'Your monthly payment is due. Please pay before the end of the month.',
                    type: 'payment_reminder',
                    is_read: false,
                    created_at: '2026-03-24T10:00:00Z',
                    recipient_name: 'John Doe',
                    recipient_email: 'john@example.com',
                    recipient_phone: '+919876543210',
                    recipient_role: 'resident'
                },
                {
                    id: '2',
                    user_id: 'user2',
                    title: 'Maintenance Notice',
                    message: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM.',
                    type: 'announcement',
                    is_read: true,
                    created_at: '2026-03-23T15:30:00Z',
                    recipient_name: 'Jane Smith',
                    recipient_email: 'jane@example.com',
                    recipient_phone: '+919876543211',
                    recipient_role: 'resident'
                }
            ];
            setNotifications(mockNotifications);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await apiConnector({
                method: apiMethods.GET,
                url: apis.user + '/all',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data?.success) {
                setUsers(response.data.data || []);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            // Fallback to mock data if API fails
            const mockUsers: User[] = [
                { id: 'user1', name: 'John Doe', email: 'john@example.com', role: 'resident' },
                { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', role: 'resident' },
                { id: 'user3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
                { id: 'user4', name: 'Mike Johnson', email: 'mike@example.com', role: 'resident' },
                { id: 'user5', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'resident' }
            ];
            setUsers(mockUsers);
        }
    };

    const handleSendNotification = async () => {
        if (!newNotification.title || !newNotification.message || newNotification.user_ids.length === 0) {
            toast.error('Please fill all required fields and select at least one user');
            return;
        }

        setLoading(true);
        try {
            const response = await apiConnector({
                method: apiMethods.POST,
                url: '/api/v1/notifications/send',
                data: newNotification,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data?.success) {
                toast.success(`Notification sent to ${newNotification.user_ids.length} users`);
                
                // Reset form
                setNewNotification({
                    title: '',
                    message: '',
                    type: 'system',
                    user_ids: []
                });
                setSelectedUsers([]);
                setShowSendForm(false);
                
                // Refresh notifications
                fetchNotifications();
            } else {
                toast.error(response.data?.message || 'Failed to send notification');
            }
        } catch (error: any) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelection = (userId: string, checked: boolean) => {
        if (checked) {
            setSelectedUsers([...selectedUsers, userId]);
            setNewNotification({
                ...newNotification,
                user_ids: [...newNotification.user_ids, userId]
            });
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
            setNewNotification({
                ...newNotification,
                user_ids: newNotification.user_ids.filter(id => id !== userId)
            });
        }
    };

    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = 
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
        const matchesType = !filters.type || filters.type === 'all' || notification.type === filters.type;
        const matchesUnread = !filters.unread_only || !notification.is_read;
        const matchesUser = !filters.user_id || filters.user_id === 'all' || notification.user_id === filters.user_id;
    
        return matchesSearch && matchesType && matchesUnread && matchesUser;
    });

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await apiConnector({
                method: apiMethods.PATCH,
                url: `/api/v1/notifications/${notificationId}/read`,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data?.success) {
                setNotifications(notifications.map(n => 
                    n.id === notificationId ? { ...n, is_read: true } : n
                ));
                toast.success('Notification marked as read');
            } else {
                toast.error('Failed to mark notification as read');
            }
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await apiConnector({
                method: apiMethods.PATCH,
                url: '/api/v1/notifications/read-all',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data?.success) {
                setNotifications(notifications.map(n => ({ ...n, is_read: true })));
                const unreadCount = notifications.filter(n => !n.is_read).length;
                toast.success(`${unreadCount} notifications marked as read`);
            } else {
                toast.error('Failed to mark all notifications as read');
            }
        } catch (error: any) {
            console.error('Error marking all notifications as read:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            const response = await apiConnector({
                method: apiMethods.DELETE,
                url: `/api/v1/notifications/${notificationId}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data?.success) {
                setNotifications(notifications.filter(n => n.id !== notificationId));
                toast.success('Notification deleted');
            } else {
                toast.error('Failed to delete notification');
            }
        } catch (error: any) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    return (
        <div className="w-full h-full overflow-auto space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">Manage system notifications and announcements</p>
                </div>
                <Button 
                    onClick={() => setShowSendForm(!showSendForm)}
                    className="gap-2"
                >
                    <Send className="size-4" />
                    Send Notification
                </Button>
            </div>

            {/* Send Notification Form */}
            {showSendForm && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="size-5" />
                            Send New Notification
                        </CardTitle>
                        <CardDescription>
                            Create and send notifications to users
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter notification title"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select 
                                    value={newNotification.type} 
                                    onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="system">System</SelectItem>
                                        <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                placeholder="Enter notification message"
                                rows={4}
                                value={newNotification.message}
                                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Select Users *</Label>
                            <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {users?.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={user.id}
                                                checked={selectedUsers.includes(user.id)}
                                                onCheckedChange={(checked) => handleUserSelection(user.id, checked as boolean)}
                                            />
                                            <Label htmlFor={user.id} className="text-sm">
                                                {user.name} ({user.role})
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button 
                                onClick={handleSendNotification}
                                disabled={loading}
                                className="gap-2"
                            >
                                {loading ? (
                                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Send Notification
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowSendForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search notifications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select 
                                value={filters.type} 
                                onValueChange={(value) => setFilters({...filters, type: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All types</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                    <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                                    <SelectItem value="announcement">Announcement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select 
                                value={filters.user_id} 
                                onValueChange={(value) => setFilters({...filters, user_id: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All users</SelectItem>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>&​nbsp;</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="unread-only"
                                    checked={filters.unread_only}
                                    onCheckedChange={(checked) => setFilters({...filters, unread_only: checked as boolean})}
                                />
                                <Label htmlFor="unread-only" className="text-sm">
                                    Unread only
                                </Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Table */}
            <NotificationsTable 
                notifications={filteredNotifications}
                isAdmin={true}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDelete={deleteNotification}
                loading={loading}
            />
        </div>
    );
}