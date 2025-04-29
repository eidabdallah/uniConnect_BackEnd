import cors from 'cors';
import { connectDB } from '../../DB/connection.js';
import { AppResponse, globalSuccessHandler } from '../utils/responseHandler.js';
import { AppError, globalhandleError } from '../utils/AppError.js';
import authRouter from './auth/auth.router.js';
import adminRouter from './admin/admin.router.js';
import userRouter from './user/user.router.js';
import cleanupSendCodes from '../utils/clearSendCode.js';
import deleteUnconfirmedAccounts from '../utils/accountCleanup.js';

export const initApp = async (app, express) => {
    connectDB();
    deleteUnconfirmedAccounts();
    cleanupSendCodes();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        const response = new AppResponse('Welcome to the uni Connect System', null, 200);
        return globalSuccessHandler(response, req, res);
    });
    app.use('/auth', authRouter);
    app.use('/admin' , adminRouter);
    app.use('/user' , userRouter);
    app.use((req, res, next) => {
        return next(new AppError('Page Not Found', 404));
    });
    
    app.use(globalhandleError);
};
