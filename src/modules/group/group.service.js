import groupModel from "../../../DB/model/group.model.js"
import postModel from './../../../DB/model/post.model.js';
import commentModel from './../../../DB/model/comment.model.js';
import groupRequestModel from './../../../DB/model/groupRequest.model.js';
import { nanoid } from "nanoid";

export const checkNameExist = async (name) => {
    return await groupModel.findOne({ name });
}
export const createdGroup = async (data) => {
    await groupModel.create(data);
}
export const findGroupById = async (id) => {
    return await groupModel.findById(id);
};
export const updateGroupById = async (id, data) => {
    return await groupModel.findByIdAndUpdate(id, data);
};
export const checkPostGroup = async (id) => {
    await postModel.find({ groupId: id });
}
export const deleteComments = async (ids) => {
    await commentModel.deleteMany({ postId: { $in: ids } });
}
export const deletePosts = async (id) => {
    await postModel.deleteMany({ groupId: id });
}
export const deletedGroup = async (id) => {
    await groupModel.findByIdAndDelete(id);
}
export const generateUniqueSlug = async (groupName) => {
    const base = groupName?.toLowerCase().replace(/\s+/g, '-') || 'group';
    let candidate = `${base}_${nanoid(4)}`;
    let exists = await groupModel.findOne({ slug: candidate });
    while (exists) {
        candidate = `${base}_${nanoid(4)}`;
        exists = await groupModel.findOne({ slug: candidate });
    }
    return candidate;
};
export const getGroupInfo = async (slug) => {
    return await groupModel.findOne({ slug })
        .populate('ownerId', 'userName profileImage')
        .populate('members', 'userName profileImage')
        .populate({
            path: 'posts',
            populate: {
                path: 'comments',
                populate: {
                    path: 'userId',
                    select: 'userName profileImage'
                }
            }
        });
}
export const getGroupsUsers = async (userId) => {
    return await groupModel.find({
        members: { $in: [userId] }
    }).select('name slug image')
}
export const checkExistingRequest = async (groupId, userId) => {
    return await groupRequestModel.findOne({ groupId, userId });
}
export const createRequestForGroup = async (groupId, userId) => {
    await groupRequestModel.create({ groupId, userId });

}
export const deleteRequestGroup = async (groupId, userId) => {
    return await groupRequestModel.findOneAndDelete({
        groupId,
        userId,
        status: 'pending'
    });
}
export const getPendingUser = async (groupId) => {
    return await groupRequestModel.find({ groupId, status: 'pending' })
        .populate('userId', 'userName profileImage');
}
export const checkRequestExist = async (requestId) => {
    return await groupRequestModel.findById(requestId).populate('groupId');
}
export const addUserToGroup = async (groupId, userId) => {
    await groupModel.findByIdAndUpdate(groupId, {
        $addToSet: { members: userId }
    });
}
export const deleteRequestById = async (requestId) => {
    await groupRequestModel.findByIdAndDelete(requestId);
};
export const leaveUser = async (groupId, id) => {
    await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: id }
    });
}
export const deleteUser = async (groupId, memberId) => {
    await groupModel.findByIdAndUpdate(groupId, {
        $pull: { members: memberId }
    });
}
