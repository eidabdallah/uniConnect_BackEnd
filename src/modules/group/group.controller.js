import { AppError } from "../../utils/AppError.js";
import { checkNameExist, createdGroup, findGroupById, updateGroupById } from "./group.service.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import cloudinary from './../../utils/cloudinary.js';

export const createGroup = async (req, res, next) => {
    const checkNameGroup = await checkNameExist(req.body.name);
    if (checkNameGroup) return next(new AppError("Group Name is Exist , use Another Name ", 400));
    req.body.ownerId = req.user._id;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/groups/${req.body.name}`
        });
        req.body.image = { secure_url, public_id }
    }
    req.body.members = [req.user._id];
    await createdGroup(req.body);
    const response = new AppResponse("Group created successfully", null, 201);
    return globalSuccessHandler(response, req, res);
};
export const updateGroup = async (req, res, next) => {
    const group = await findGroupById(req.params.id);
    if (!group) {
        return next(new AppError("Group not found", 404));
    }
    if (group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to update this group", 403));
    }
    if (req.body.name) {
        const result = await checkNameExist(req.body.name);
        if (result) return next(new AppError("Group Name is Exist , use Another Name ", 400));
    }
    if (req.file) {
        if (group.image?.public_id) {
            await cloudinary.uploader.destroy(group.image.public_id);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/groups/${group.name}`
        });
        req.body.image = { secure_url, public_id };
    }
    await updateGroupById(req.params.id, req.body);
    const response = new AppResponse("Group updated successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
export const deleteGroup = async (req, res, next) => { };
export const getAllGroups = async (req, res, next) => { };
export const getGroupById = async (req, res, next) => { };

// Member Management
export const joinGroupRequest = async (req, res, next) => { };
export const cancelJoinRequest = async (req, res, next) => { };
export const getPendingRequests = async (req, res, next) => { };
export const acceptJoinRequest = async (req, res, next) => { };
export const rejectJoinRequest = async (req, res, next) => { };
export const leaveGroup = async (req, res, next) => { };
export const removeMember = async (req, res, next) => { };

// Group Posts
export const createGroupPost = async (req, res, next) => { };
export const getGroupPosts = async (req, res, next) => { };
export const updateGroupPost = async (req, res, next) => { };
export const deleteGroupPost = async (req, res, next) => { };