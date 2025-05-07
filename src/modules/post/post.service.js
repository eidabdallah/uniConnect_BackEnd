import postModel from "../../../DB/model/post.model.js";
import friendRequestModel from './../../../DB/model/friendRequest.model.js';
import groupModel from './../../../DB/model/group.model.js';

export const createPostData = async (postData) => {
    return await postModel.create(postData);
};
export const getFriendsIds = async (userId) => {
    const friendRequests = await friendRequestModel.find({
        status: 'accepted',
        $or: [{ senderId: userId }, { receiverId: userId }]
    });
    return friendRequests.map(req =>
        req.senderId.toString() === userId.toString() ? req.receiverId : req.senderId
    );
};
export const getGroupIds = async (userId) => {
    const groups = await groupModel.find({ members: userId }, '_id');
    return groups.map(group => group._id);
};
export const getPostsByUserAndFriends = async (userIds) => {
    return await postModel.find({
        userId: { $in: userIds },
        visibility: { $in: ['public', 'friends-only'] }
    }).populate('userId', 'userName image').populate('groupId', 'name').sort({ createdAt: -1 });
};
export const checkPostExist = async (postId) => {
    return await postModel.findById(postId);
}
export const isPostLikedByUser = async (postId, userId) => {
    const post = await postModel.findOne({ _id: postId, likes: userId });
    return !!post; 
};

export const addLikeToPost = async (postId, userId) => {
    return await postModel.updateOne(
        { _id: postId },
        { $addToSet: { likes: userId } }
    );
};

export const removeLikeFromPost = async (postId, userId) => {
    return await postModel.updateOne(
        { _id: postId },
        { $pull: { likes: userId } }
    );
};