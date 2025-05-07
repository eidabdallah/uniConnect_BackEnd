import friendRequestModel from "../../../DB/model/friendRequest.model.js";
import userModel from "../../../DB/model/user.model.js";

export const getAcceptedFriendRequests = async (userId) => {
    return await friendRequestModel.find({
        $or: [
            { senderId: userId, status: 'accepted' },
            { receiverId: userId, status: 'accepted' }
        ]
    });
};
export const getUserDetailsByIds = async (friendIds) => {
    return await userModel.find({ _id: { $in: friendIds } }).select('userName profileImage slug _id');
};
export const checkIdExists = async (receiverId) => {
    return await userModel.findById(receiverId);
}
export const checkExistingFriendRequest = async (senderId, receiverId) => {
    return await friendRequestModel.findOne({
        $or: [{ senderId, receiverId }, { senderId: receiverId, receiverId: senderId }]
    });
};
export const sendNewFriendRequest = async (senderId, receiverId) => {
    return await friendRequestModel.create({ senderId, receiverId, status: 'pending' });
};
export const getAllFriendRequest = async (userId) => {
    return await friendRequestModel.find({
        receiverId: userId,
        status: 'pending'
    }).populate('senderId', 'userName profileImage slug');
}
export const checkRequestExists = async (requestId, userId) => {
    return await friendRequestModel.findOne({
        _id: requestId,
        receiverId: userId,
        status: 'pending'
    });
}
export const unfriendUser = async (userId, friendId) => {
    return await friendRequestModel.findOneAndDelete({
        status: 'accepted',
        $or: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId }
        ]
    });
};

export const cancelPendingFriendRequest = async (senderId, receiverId) => {
    return await friendRequestModel.findOneAndDelete({
        senderId,
        receiverId,
        status: 'pending'
    });
};
