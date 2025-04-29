import { AppError } from "../../utils/AppError.js";
import { checkEmailExists, checkUniversityIdExists, confirmUserEmail, registerUser } from "./auth.service.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import cloudinary from './../../utils/cloudinary.js';
import bcrypt from 'bcryptjs';
import { confirmEmailMessage, sendCodeToEmail, sendConfirmationEmail } from "../../utils/emailTemplates.js";
import jwt from 'jsonwebtoken';
import { customAlphabet } from "nanoid";

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
export const confirmEmail = async (req, res, next) => {
    const { token } = req.params;
    if (!token) return next(new AppError("Token is required", 400));
    const decodedToken = jwt.verify(token, process.env.JWT_ConfirmEmail_SECRET);
    const user = await confirmUserEmail(decodedToken.email);
    if (!user) return next(new AppError("User not found or already confirmed", 404));
    await confirmEmailMessage(user.userName, res);
}
export const changePassword = async (req, res, next) => {
    const { universityId, oldPassword, newPassword } = req.body;
    if (req.user.universityId !== universityId) return next(new AppError('The university Id provided does not match your account.', 403));
    const user = await checkUniversityIdExists(universityId);
    if (!user) return next(new AppError('university Id not found', 404));
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) return next(new AppError('Invalid old password', 403));
    user.password = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND));
    await user.save();
    const response = new AppResponse('Password changed successfully', null, 200);
    return globalSuccessHandler(response, req, res);
}

export const sendCode = async (req, res, next) => {
    const { email, universityId } = req.body;
    const user = await checkUniversityIdExists(universityId);
    if (!user) return next(new AppError('universityId not found', 404));
    if (email != user.email) {
        return next(new AppError('The email you entered does not match your university email. Please use your university-issued email to proceed', 404));
    }
    const code = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 6)();
    user.sendCode = code;
    await user.save();
    await sendCodeToEmail(email, code);
    const response = new AppResponse('Code sent successfully', null, 200);
    return globalSuccessHandler(response, req, res);
}

export const resetPassword = async (req, res, next) => {
    const { universityId, email, password, code } = req.body;
    const user = await checkUniversityIdExists(universityId);
    if (!user) return next(new AppError('university Id not found', 404));
    if (user.email != email) return next(new AppError('The Email not Correct', 404));
    if (user.sendCode !== code) return next(new AppError('Invalid code', 403));
    user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    user.sendCode = null;
    await user.save();
    const response = new AppResponse('Password reset successfully', null, 200);
    return globalSuccessHandler(response, req, res);
}