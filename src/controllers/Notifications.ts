import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { query } from '../config/db';
import { CustomRequest } from '../types/CustomRequest';

// Send notification to users
const sendNotification = catchAsync(
    async (req: Request, res: Response) => {
        const { title, message, user_ids, type } = req.body;
        
        if (!title || !message || !user_ids || !Array.isArray(user_ids)) {
            return res.status(400).json({
                success: false,
                message: 'Title, message, and user_ids array are required'
            });
        }

        // Create notifications for all specified users
        const values = user_ids.map((userId: string, index: number) => 
            `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`
        ).join(', ');

        const params = user_ids.flatMap((userId: string) => [userId, title, message, type || 'system']);
        
        const insertQuery = `
            INSERT INTO notifications (user_id, title, message, type)
            VALUES ${values}
            RETURNING *
        `;

        const result = await query(insertQuery, params);

        res.status(201).json({
            success: true,
            message: `Notification sent to ${user_ids.length} users`,
            data: result.rows
        });
    }
);

// Get notifications for current user
const getUserNotifications = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as CustomRequest).user?.id;
        const { page = 1, limit = 20, unread_only = false } = req.query;

        let whereClause = 'WHERE n.user_id = $1';
        let params: any[] = [userId];

        if (unread_only === 'true') {
            whereClause += ' AND n.is_read = FALSE';
        }

        const offset = (Number(page) - 1) * Number(limit);

        const notificationsQuery = `
            SELECT 
                n.id,
                n.title,
                n.message,
                n.type,
                n.is_read,
                n.created_at,
                u.name as sender_name,
                u.email as sender_email
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            ${whereClause}
            ORDER BY n.created_at DESC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM notifications n
            ${whereClause}
        `;

        const [notificationsResult, countResult] = await Promise.all([
            query(notificationsQuery, [...params, limit, offset]),
            query(countQuery, params)
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / Number(limit));

        res.status(200).json({
            success: true,
            data: notificationsResult.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages,
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        });
    }
);

// Get all notifications (admin only)
const getAllNotifications = catchAsync(
    async (req: Request, res: Response) => {
        const { page = 1, limit = 20, user_id, type, unread_only = false } = req.query;

        let whereClause = '';
        let params: any[] = [];
        let paramIndex = 1;

        if (user_id) {
            whereClause += ` WHERE n.user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        if (type) {
            whereClause += whereClause ? ` AND n.type = $${paramIndex}` : ` WHERE n.type = $${paramIndex}`;
            params.push(type);
            paramIndex++;
        }

        if (unread_only === 'true') {
            whereClause += whereClause ? ` AND n.is_read = FALSE` : ` WHERE n.is_read = FALSE`;
        }

        const offset = (Number(page) - 1) * Number(limit);

        const notificationsQuery = `
            SELECT 
                n.id,
                n.user_id,
                n.title,
                n.message,
                n.type,
                n.is_read,
                n.created_at,
                u.name as recipient_name,
                u.email as recipient_email,
                u.phone_number,
                u.role
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            ${whereClause}
            ORDER BY n.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM notifications n
            ${whereClause}
        `;

        const [notificationsResult, countResult] = await Promise.all([
            query(notificationsQuery, [...params, limit, offset]),
            query(countQuery, params)
        ]);

        const total = parseInt(countResult.rows[0].total);
        const totalPages = Math.ceil(total / Number(limit));

        res.status(200).json({
            success: true,
            data: notificationsResult.rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages,
                hasNext: Number(page) < totalPages,
                hasPrev: Number(page) > 1
            }
        });
    }
);

// Mark notification as read
const markNotificationAsRead = catchAsync(
    async (req: Request, res: Response) => {
        const { notificationId } = req.params;
        const userId = (req as CustomRequest).user?.id;

        const updateQuery = `
            UPDATE notifications 
            SET is_read = TRUE
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;

        const result = await query(updateQuery, [notificationId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or you do not have permission to update it'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: result.rows[0]
        });
    }
);

// Mark all notifications as read for user
const markAllNotificationsAsRead = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as CustomRequest).user?.id;

        const updateQuery = `
            UPDATE notifications 
            SET is_read = TRUE
            WHERE user_id = $1 AND is_read = FALSE
            RETURNING *
        `;

        const result = await query(updateQuery, [userId]);

        res.status(200).json({
            success: true,
            message: `Marked ${result.rows.length} notifications as read`,
            data: result.rows
        });
    }
);

// Delete notification
const deleteNotification = catchAsync(
    async (req: Request, res: Response) => {
        const { notificationId } = req.params;
        const userId = (req as CustomRequest).user?.id;

        const deleteQuery = `
            DELETE FROM notifications 
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;

        const result = await query(deleteQuery, [notificationId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or you do not have permission to delete it'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: result.rows[0]
        });
    }
);

// Get notification statistics
const getNotificationStats = catchAsync(
    async (req: Request, res: Response) => {
        const userId = (req as CustomRequest).user?.id;

        const statsQuery = `
            SELECT 
                COUNT(*) as total_notifications,
                COUNT(*) FILTER (WHERE is_read = FALSE) as unread_notifications,
                COUNT(*) FILTER (WHERE type = 'payment_reminder') as payment_reminders,
                COUNT(*) FILTER (WHERE type = 'announcement') as announcements,
                COUNT(*) FILTER (WHERE type = 'system') as system_notifications
            FROM notifications
            WHERE user_id = $1
        `;

        const result = await query(statsQuery, [userId]);

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    }
);

export {
    sendNotification,
    getUserNotifications,
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getNotificationStats
};
