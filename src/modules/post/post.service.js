import postModel from "../../../DB/model/post.model.js";
import friendRequestModel from './../../../DB/model/friendRequest.model.js';

export const createPostData = async (postData) => {
    return await postModel.create(postData);
};
export const getUserOwnPosts = async (userId) => {
    return await postModel.find({ userId }).sort({ createdAt: -1 });
};

export const getUserProfilePosts = async (profileId, isFriend) => {
    const visibilityConditions = [{ visibility: 'public' }];
    if (isFriend) {
        visibilityConditions.push({ visibility: 'friends-only' });
    }
    return await postModel.find({
        userId: profileId,
        $or: visibilityConditions
    }).sort({ createdAt: -1 });
};
export const getFriendStatus = async (userId, profileId) => {
    return await friendRequestModel.find({
        $or: [
            { senderId: userId, receiverId: profileId, status: 'accepted' },
            { senderId: profileId, receiverId: userId, status: 'accepted' }
        ]
    });
};