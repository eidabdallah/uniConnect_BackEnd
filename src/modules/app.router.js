import cors from 'cors';
import { connectDB } from '../../DB/connection.js';
import { AppResponse, globalSuccessHandler } from '../utils/responseHandler.js';
import { AppError, globalhandleError } from '../utils/AppError.js';
import authRouter from './auth/auth.router.js';
export const initApp = async (app, express) => {
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        const response = new AppResponse('Welcome to the uni Connect System', null, 200);
        return globalSuccessHandler(response, req, res);
    });
    app.use('/auth', authRouter);
    app.use((req, res, next) => {
        return next(new AppError('Page Not Found', 404));
    });
    
    app.use(globalhandleError);
};
