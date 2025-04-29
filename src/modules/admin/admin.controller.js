import { AppError } from "../../utils/AppError.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import { checkEmailExists, checkIdExists, checkUniversityIdExists, getUsersByRole, registerAdmin } from "./admin.service.js";
import bcrypt from 'bcryptjs';

export const getAllUsersByRole = async (req, res, next) => {
    const { role } = req.query;
    if (req.user.role === 'admin' && (role === 'superAdmin' || role === 'admin')) {
        return next(new AppError("You are not allowed to access superAdmin and admin lists", 403));
    }
    const users = await getUsersByRole(role);
    const response = new AppResponse(`${role}s fetched successfully`, users, 200, 'users');
    return globalSuccessHandler(response, req, res);
};
export const createAdmin = async (req, res, next) => {
    const { universityId } = req.body;
    if (await checkUniversityIdExists(universityId)) {
        return next(new AppError('University ID already Exist', 409));
    }
    if (await checkEmailExists(req.body.email)) {
        return next(new AppError('Email already Exist', 409));
    }
    req.body.role = 'admin';
    req.body.password = bcrypt.hashSync(req.body.password, parseInt(process.env.SALTROUND));
    await registerAdmin(req.body);
    const response = new AppResponse('Admin registered successfully', null, 201);
    return globalSuccessHandler(response, req, res);
};
export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await checkIdExists(id);
    if (!user)
        return next(new AppError('user not found', 404));
    if (req.user.role === 'admin' && ['admin', 'superAdmin'].includes(user.role)) {
        return next(new AppError('You are not allowed to delete this user', 403));
    }
    await user.deleteOne();
    const response = new AppResponse('user deleted successfully', null, 200);
    return globalSuccessHandler(response, req, res);
};
export const toggleStatus = async (req, res, next) => {
    const { id } = req.params;
    const user = await checkIdExists(id);
    if (!user)
        return next(new AppError("user not found", 404));
    if (req.user.role === 'admin' && ['admin', 'superAdmin'].includes(user.role)) {
        return next(new AppError('You are not allowed to change the status of this user', 403));
    }
    const newStatus = user.status === 'Active' ? 'NotActive' : 'Active';
    user.status = newStatus;
    await user.save();
    const response = new AppResponse(`Status updated to ${newStatus}`, null, 200);
    return globalSuccessHandler(response, req, res);
};
export const updateRole = async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await checkIdExists(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    if (user.role === 'student') {
        return next(new AppError('Students are not allowed to change their role', 403));
    }
    if (req.user.role === 'admin' && role === 'superAdmin') {
        return next(new AppError('You are not allowed to assign superAdmin role', 403));
    }
    user.role = role;
    await user.save();
    const response = new AppResponse(`Role updated to ${role}`, null, 200);
    return globalSuccessHandler(response, req, res);
}

export const adminResetUserCredentials = async (req, res, next) => {
    const { universityId, password } = req.body;
    const user = await checkIdExists(req.params.id);
    if (!user)
        return next(new AppError('User not found', 404));
    if (universityId != user.universityId)
        return next(new AppError("university Id does not match with user's university Id", 400));

    user.password = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    await user.save();
    const response = new AppResponse('User credentials updated successfully', null, 200);
    return globalSuccessHandler(response, req, res);
}
export const changeConfirmEmail = async (req, res, next) => {
    const { id } = req.params;
    const user = await checkIdExists(id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    user.confirmEmail = true;
    user.save();
    const response = new AppResponse('confirm Email updated to True', null, 200);
    return globalSuccessHandler(response, req, res);
}