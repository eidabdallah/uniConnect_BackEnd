import userModel from "../../../DB/model/user.model.js";
import friendRequestModel from './../../../DB/model/friendRequest.model.js';
import postModel from './../../../DB/model/post.model.js';

export const checkIdExists = async (id) => {
    return await userModel.findById(id).select('userName universityId email bio profileImage');
};
export const getUserPostsForProfile = async (profileId, visitorId, isOwner) => {
    const baseQuery = {
        userId: profileId,
        groupId: null
    };
    if (!isOwner) {
        const isFriend = await friendRequestModel.exists({
            $or: [
                { senderId: visitorId, receiverId: profileId, status: 'accepted' },
                { senderId: profileId, receiverId: visitorId, status: 'accepted' }
            ]
        });

        const visibilityConditions = [{ visibility: 'public' }];
        if (isFriend) visibilityConditions.push({ visibility: 'friends-only' });
        baseQuery["$or"] = visibilityConditions;
    }
    const posts = await postModel.find(baseQuery)
        .populate('likes', 'userName profileImage')
        .populate({
            path: 'comments',
            populate: {
                path: 'userId',
                select: 'userName image'
            }
        })
        .sort({ createdAt: -1 });
    const postsWithLikeStatus = posts.map(post => {
        const updatedComments = post.comments.map(comment => {
            const likedByCurrentUser = comment.likes?.some(userId => userId.toString() === visitorId.toString());
            return {
                ...comment.toObject(),
                likedByCurrentUser
            };
        });
        return {
            ...post.toObject(),
            comments: updatedComments
        };
    });
    return postsWithLikeStatus;
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
