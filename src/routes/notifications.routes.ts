import { Router } from 'express';
import { auth, isAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { 
    sendNotification,
    getUserNotifications,
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getNotificationStats
} from '../controllers/Notifications';

const notificationRouter = Router();

// Admin routes
notificationRouter.post('/send', auth, isAdmin, sendNotification);
notificationRouter.get('/all', auth, isAdmin, getAllNotifications);
notificationRouter.get('/stats', auth, getNotificationStats);

// User routes (both admin and residents)
notificationRouter.get('/my', auth, getUserNotifications);
notificationRouter.get('/stats/my', auth, getNotificationStats);
notificationRouter.patch('/:notificationId/read', auth, markNotificationAsRead);
notificationRouter.patch('/read-all', auth, markAllNotificationsAsRead);
notificationRouter.delete('/:notificationId', auth, deleteNotification);

export default notificationRouter;
