import { Router } from 'express';
import { auth, isAdmin } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { generateReport, getReportRecords } from '../controllers/Reports';
import { reportBodyZodSchema } from '../validations/reports.validation';

const reportRouter = Router();

reportRouter.post('/', auth, isAdmin, validate({ body: reportBodyZodSchema }), generateReport);
reportRouter.get('/records', auth, isAdmin, getReportRecords);

export default reportRouter;