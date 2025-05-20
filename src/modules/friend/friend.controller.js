import notificationModel from "../../../DB/model/notification.model.js";
import { AppError } from "../../utils/AppError.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { getIO } from "../../utils/socket.js";
import { cancelPendingFriendRequest, checkExistingFriendRequest, checkIdExists, checkRequestExists, getAcceptedFriendRequests, getAllFriendRequest, getUserDetailsByIds, sendNewFriendRequest, unfriendUser } from "./friend.service.js";

export const getUserFriends = async (req, res, next) => {
    const userId = req.user._id;
    const acceptedRequests = await getAcceptedFriendRequests(userId);
    const friendIds = acceptedRequests.map(req =>
        req.senderId.toString() === userId.toString() ? req.receiverId : req.senderId
    );
    const friends = await getUserDetailsByIds(friendIds);

    const response = new AppResponse('Friends fetched successfully', friends, 200, 'friends');
    return globalSuccessHandler(response, req, res);
};
export const createFriendRequest = async (req, res, next) => {
    const senderId = req.user._id;
    const { receiverId } = req.body;
    if (senderId.toString() === receiverId.toString()) {
        return next(new AppError('Cannot send friend request to yourself', 400));
    }
    const receiverExists = await checkIdExists(receiverId);
    if (!receiverExists) {
        return next(new AppError('Receiver not found', 404));
    }
    const existingRequest = await checkExistingFriendRequest(senderId, receiverId);
    if (existingRequest) {
        return next(new AppError('Friend request already exists or is pending', 400));
    }
    const newRequest = await sendNewFriendRequest(senderId, receiverId);

    const notification = await notificationModel.create({
        userId: receiverId,
        content: `${req.user.userName} sent you a friend request`,
        notificationType: 'friend_request',
    });

    const io = getIO();
    io.to(receiverExists.slug).emit('newNotification', notification);

    const response = new AppResponse('Friend request sent successfully', newRequest, 200, 'request');
    return globalSuccessHandler(response, req, res);
};
export const getFriendRequests = async (req, res, next) => {
    const userId = req.user._id;
    const friendRequests = await getAllFriendRequest(userId);
    if (!friendRequests || friendRequests.length === 0) {
        return next(new AppError('No pending friend requests', 404));
    }
    const response = new AppResponse('Friend requests fetched successfully', friendRequests, 200, 'requests');
    return globalSuccessHandler(response, req, res);
};
export const respondToFriendRequest = async (req, res, next) => {
    const userId = req.user._id;
    const { requestId, action } = req.body;
    const friendRequest = await checkRequestExists(requestId, userId);
    if (!friendRequest) {
        return next(new AppError('Friend request not found or already responded to', 404));
    }
    friendRequest.status = action;
    await friendRequest.save();


    if (action === 'accepted') {
        const sender = await checkIdExists(friendRequest.senderId);
        const notification = await notificationModel.create({
            userId: friendRequest.senderId,
            content: `${req.user.userName} accepted your friend request`,
            notificationType: 'friend_request',
        });
        const io = getIO();
        io.to(sender.slug).emit('newNotification', notification);
    }

    const response = new AppResponse('Friend request updated successfully', friendRequest, 200, 'request');
    return globalSuccessHandler(response, req, res);
};
export const removeFriendOrCancelRequest = async (req, res, next) => {
    const userId = req.user._id;
    const { targetId, action } = req.body;
    let result;
    if (action === 'unfriend') {
        result = await unfriendUser(userId, targetId);
        if (!result) return next(new AppError('Friendship not found', 404));

        const response = new AppResponse('Friend removed successfully', null, 200);
        return globalSuccessHandler(response, req, res);

    } else if (action === 'cancel') {
        result = await cancelPendingFriendRequest(userId, targetId);
        if (!result) return next(new AppError('No pending friend request found to cancel', 404));

        const response = new AppResponse('Friend request cancelled', null, 200);
        return globalSuccessHandler(response, req, res);

    } else {
        return next(new AppError('Invalid action', 400));
    }
};

