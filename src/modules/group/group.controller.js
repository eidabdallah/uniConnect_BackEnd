import { AppError } from "../../utils/AppError.js";
import * as serviceFun from "./group.service.js";
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import cloudinary from './../../utils/cloudinary.js';

export const getUserGroups = async (req, res, next) => {
    const groups = await serviceFun.getGroupsUsers(req.user._id);
    if (groups.length === 0) {
        return next(new AppError("No groups found for this user", 404));
    }
    const response = new AppResponse("Groups fetched successfully", groups, 200, 'groups');
    return globalSuccessHandler(response, req, res);
};
export const getGroupBySlug = async (req, res, next) => {
    const group = await serviceFun.getGroupInfo(req.params.slug);
    if (!group) {
        return next(new AppError("Group not found", 404));
    }
    const isMember = group.members.some(
        member => member._id.toString() === req.user._id.toString()
    );
    if (group.type === 'private' && !isMember) {
        return next(new AppError("You must join the group to view its posts", 403));
    }
    const response = new AppResponse("Group fetched successfully", {
        name: group.name, slug: group.slug, description: group.description,
        image: group.image, owner: group.ownerId,
        members: group.members, type: group.type,
        posts: group.posts,
    }, 200, 'group');

    return globalSuccessHandler(response, req, res);
};
export const createGroup = async (req, res, next) => {
    const checkNameGroup = await serviceFun.checkNameExist(req.body.name);
    if (checkNameGroup) return next(new AppError("Group Name is Exist , use Another Name ", 400));
    req.body.ownerId = req.user._id;
    req.body.slug = await serviceFun.generateUniqueSlug(req.body.name);
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/groups/${req.body.name}`
        });
        req.body.image = { secure_url, public_id }
    }
    req.body.members = [req.user._id];
    await serviceFun.createdGroup(req.body);
    const response = new AppResponse("Group created successfully", null, 201);
    return globalSuccessHandler(response, req, res);
};
export const updateGroup = async (req, res, next) => {
    const group = await serviceFun.findGroupById(req.params.id);
    if (!group) {
        return next(new AppError("Group not found", 404));
    }
    if (group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to update this group", 403));
    }
    if (req.body.name) {
        const result = await serviceFun.checkNameExist(req.body.name);
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
    await serviceFun.updateGroupById(req.params.id, req.body);
    const response = new AppResponse("Group updated successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
export const deleteGroup = async (req, res, next) => {
    const group = await serviceFun.findGroupById(req.params.id);
    if (!group) {
        return next(new AppError("Group not found", 404));
    }
    if (group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to delete this group", 403));
    }
    const posts = await serviceFun.checkPostGroup(req.params.id);
    const postIds = posts.map(post => post._id);
    await serviceFun.deleteComments(postIds);
    await serviceFun.deletePosts(req.params.id);
    await serviceFun.deletedGroup(req.params.id);
    const response = new AppResponse("Group deleted successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};


export const joinGroupRequest = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await serviceFun.findGroupById(groupId);
    if (!group) return next(new AppError("Group not found", 404));
    const existingRequest = await serviceFun.checkExistingRequest(groupId, req.user._id);
    if (existingRequest) return next(new AppError("You already have a pending or processed request", 400));
    await serviceFun.createRequestForGroup(groupId, req.user._id);
    const response = new AppResponse("Join request sent successfully", null, 201);
    return globalSuccessHandler(response, req, res);
};
export const cancelJoinRequest = async (req, res, next) => {
    const { groupId } = req.params;
    const request = await serviceFun.deleteRequestGroup(groupId, req.user._id);
    if (!request) return next(new AppError("No pending join request found", 404));
    const response = new AppResponse("Join request cancelled successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
export const getPendingRequests = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await serviceFun.findGroupById(groupId);
    if (!group || group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("Unauthorized or group not found", 403));
    }
    const requests = await serviceFun.getPendingUser(groupId);
    const response = new AppResponse("Pending requests fetched successfully", requests, 200, 'requests');
    return globalSuccessHandler(response, req, res);
};
export const handleJoinRequestDecision = async (req, res, next) => {
    const { requestId } = req.params;
    const { action } = req.body;
    const request = await serviceFun.checkRequestExist(requestId);
    if (!request) return next(new AppError("Request not found", 404));

    const group = request.groupId;
    if (group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("Unauthorized to modify this request", 403));
    }
    if (action === 'accepted') {
        await serviceFun.addUserToGroup(group._id, request.userId);
    }
    await serviceFun.deleteRequestById(requestId);
    const response = new AppResponse(`Request ${action === 'accepted' ? 'accepted' : 'rejected'} successfully`, null, 200);
    return globalSuccessHandler(response, req, res);
};

export const leaveGroup = async (req, res, next) => {
    const { groupId } = req.params;
    const group = await serviceFun.findGroupById(groupId);
    if (!group) return next(new AppError("Group not found", 404));

    if (!group.members.includes(req.user._id)) {
        return next(new AppError("You are not a member of this group", 400));
    }
    await serviceFun.leaveUser(groupId, req.user._id);
    const response = new AppResponse("You have left the group", null, 200);
    return globalSuccessHandler(response, req, res);
};
export const removeMember = async (req, res, next) => {
    const { groupId, memberId } = req.params;
    const group = await serviceFun.findGroupById(groupId);
    if (!group || group.ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("Unauthorized or group not found", 403));
    }
    if (!group.members.includes(memberId)) {
        return next(new AppError("User is not a member of this group", 400));
    }
    await serviceFun.deleteUser(groupId, memberId);
    const response = new AppResponse("Member removed successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};

