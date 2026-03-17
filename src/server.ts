import express from 'express';
import { ENV } from './validations/env.validation.ts';
import { query } from './config/db.ts';
import userRouter from './routes/user.routes.ts';
import { globalErrorHandler } from './middlewares/error.middleware.ts';
import { notFound } from './utils/response.ts';
import subscriptionRouter from './routes/subscription.routes.ts';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(fileUpload({ 
    useTempFiles: true, 
    tempFileDir: process.platform === 'win32' ? './tmp/' : '/tmp/',
    limits: { fileSize: 800 * 1024 * 1024 }, // 800MB limit
    abortOnLimit: true,
    createParentPath: true
}));
app.use(cors({
    origin: ENV.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

const PORT = ENV.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const textQuery = `SELECT NOW()`;

query(textQuery)
    .then(
        (result) => console.log('Successful query execution: ' + result.rows[0].now)
    ).catch(
        (err: Error) => console.error('Query Failed : ' + err.message)
    )



app.get('/', (_req, res) => {
    res.json({
        message: "Society Subscription Management API is Live!",
        status: "Healthy"
    });
});

// Handle undefined Routes
app.use((req, res) => {
    notFound(res, `Can't find ${req.originalUrl} on this server!`);
});

// Global Error Handler Middleware
app.use(globalErrorHandler);