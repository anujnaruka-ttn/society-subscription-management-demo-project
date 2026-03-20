import express from 'express';
import { ENV } from './validations/env.validation.ts';
import { migrate } from './controllers/Schema.ts';
import { query } from './config/db.ts';
import { globalErrorHandler } from './middlewares/error.middleware.ts';
import { notFound } from './utils/response.ts';
import userRouter from './routes/user.routes.ts';
import subscriptionRouter from './routes/subscription.routes.ts';
import flatRouter from './routes/flat.routes.ts';
import billingRouter from './routes/billing.routes.ts';
import paymentRouter from './routes/payment.routes.ts';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { cloudinaryConnecter } from './config/cloudinary.ts';
const app = express();

// File upload middleware - MUST come before body parsers
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/', // Ubuntu/Linux temp directory
    limits: { fileSize: 800 * 1024 * 1024 }, // 800MB limit
    abortOnLimit: true,
    createParentPath: true
}));

// Body parsers - AFTER fileUpload
app.use(express.json());

app.use(cors({
    origin: ENV.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/flats', flatRouter);
app.use('/api/v1/billing', billingRouter);
app.use('/api/v1/payments', paymentRouter);

const PORT = ENV.PORT;

// Run database migration on startup
migrate();

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

cloudinaryConnecter();

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