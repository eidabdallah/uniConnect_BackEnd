import userModel from "../../../DB/model/user.model.js";
import friendRequestModel from './../../../DB/model/friendRequest.model.js';
import postModel from './../../../DB/model/post.model.js';

export const checkIdExists = async (id) => {
    return await userModel.findById(id).select('userName universityId email bio profileImage');
};
export const getUserPostsForProfile = async (profileId, visitorId, isOwner) => {
    if (isOwner) {
        return await postModel.find({ userId: profileId, groupId: null }).populate('likes', 'userName profileImage').sort({ createdAt: -1 });
    }

    const isFriend = await friendRequestModel.exists({
        $or: [
            { senderId: visitorId, receiverId: profileId, status: 'accepted' },
            { senderId: profileId, receiverId: visitorId, status: 'accepted' }
        ]
    });

    const visibilityConditions = [{ visibility: 'public' }];
    if (isFriend) visibilityConditions.push({ visibility: 'friends-only' });

    return await postModel.find({
        userId: profileId,
        $or: visibilityConditions,
        groupId: null
    }).populate('likes', 'userName profileImage').sort({ createdAt: -1 });
};

export const getUserFriends = async (userId) => {
    const acceptedRequests = await friendRequestModel.find({
        $or: [
            { senderId: userId, status: 'accepted' },
            { receiverId: userId, status: 'accepted' }
        ]
    });

    const friendIds = acceptedRequests.map(req =>
        req.senderId.toString() === userId.toString() ? req.receiverId : req.senderId
    );

    return await userModel.find({ _id: { $in: friendIds } }, '-password -sendCode -status -role -confirmEmail -createdAt -updatedAt').limit(3);
};
export const getUserBySlug = async (slug) => {
    return await userModel.findOne({ slug }).select('userName universityId college profileImage bio isOnline');
};
