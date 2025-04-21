import { AppError } from "../../utils/AppError.js";
import { checkEmailExists, checkUniversityIdExists, registerUser } from "./auth.service.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import cloudinary from './../../utils/cloudinary.js';
import bcrypt from 'bcryptjs';
import { sendConfirmationEmail } from "../../utils/emailTemplates.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
    const { universityId } = req.body;
    if (await checkUniversityIdExists(universityId)) {
        return next(new AppError('University ID already Exist', 409));
    }
    if (universityId.length === 8) {
        req.body.email = `s${universityId}@stu.najah.edu`;
    }
    else if (universityId.length === 4) {
        if (!email) {
            return next(new AppError('Email is required for this type', 400));
        }
        if (await checkEmailExists(email)) {
            return next(new AppError('Email already Exist', 409));
        }
    }
    req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALTROUND));
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/profilePicture/${universityId}`
        });
        req.body.profileImage = { secure_url, public_id };
    }
    await registerUser(req.body);
    await sendConfirmationEmail(universityId, req.body.email, req.body.userName, req);
    const response = new AppResponse('User registered successfully', null, 201);
    return globalSuccessHandler(response, req, res);
}

export const login = async (req, res, next) => {
    const { universityId, password } = req.body;
    const user = await checkUniversityIdExists(universityId);
    if (!user)
        return next(new AppError('Invalid credentials', 400));
    if (!user.confirmEmail)
        return next(new AppError('Please confirm your email first', 403));
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
        return next(new AppError('Invalid credentials', 400));
    if (user.status === 'NotActive')
        return next(new AppError('Your account is blocked, contact support.', 403));

    const token = jwt.sign({ id: user._id, role: user.role, status: user.status, isOnline: user.isOnline, profileImage: user.profileImage }, process.env.JWT_LOGIN_SECRET, { expiresIn: '10h' });

    const response = new AppResponse('Logged in successfully', token, 200, 'token');
    return globalSuccessHandler(response, req, res);
}