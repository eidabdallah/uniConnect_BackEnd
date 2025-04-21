import { AppError } from "../../utils/AppError.js";
import { checkEmailExists, checkUniversityIdExists, registerUser } from "./auth.service.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import cloudinary from './../../utils/cloudinary.js';
import bcrypt from 'bcryptjs';
import { sendConfirmationEmail } from "../../utils/emailTemplates.js";

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