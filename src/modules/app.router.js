import cors from 'cors';
import { connectDB } from '../../DB/connection.js';
import { AppResponse, globalSuccessHandler } from '../utils/responseHandler.js';
import { globalhandleError } from '../utils/AppError.js';
export const initApp = async (app, express) => {
    connectDB();
    app.use(cors());
    app.use(express.json());
    app.get('/', (req, res) => {
        const response = new AppResponse('Welcome to the uni Connect System', null , 200);
        return globalSuccessHandler(response, req, res);
    });
    app.use(globalhandleError);
    // app.use('*', (req, res) => {
    //     return res.status(404).json({ message: 'Page Not Found' });
    // });
};
