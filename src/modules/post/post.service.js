import commentModel from "../../../DB/model/comment.model.js";
import postModel from "../../../DB/model/post.model.js";
import friendRequestModel from './../../../DB/model/friendRequest.model.js';
import groupModel from './../../../DB/model/group.model.js';

export const createPostData = async (postData) => {
    return await postModel.create(postData);
};
export const getPostWithComments = async (postId) => {
    return await postModel.findById(postId)
        .populate({
            path: 'comments',
            populate: { path: 'userId', select: 'userName' }
        });
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
export const getPostsByUserAndFriends = async (userIds, currentUserId) => {
    const posts = await postModel.find({
        userId: { $in: userIds },
        visibility: { $in: ['public', 'friends-only'] }
    })
        .populate('userId', 'userName image')
        .populate('groupId', 'name')
        .populate({
            path: 'comments',
            select: 'text image createdAt likes',
            populate: {
                path: 'userId',
                select: 'userName image'
            }
        })
        .sort({ createdAt: -1 });
    const postsWithLikeStatus = posts.map(post => {
        const updatedComments = post.comments.map(comment => {
            const likedByCurrentUser = comment.likes?.some(userId => userId.toString() === currentUserId.toString());
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
export const deletedPost = async (id) => {
    return await postModel.findByIdAndDelete(id);
}
export const updatePostData = async (id, data) => {
    return await postModel.findByIdAndUpdate(id, data, { new: true });
};
export const checkPostComment = async (id) => {
    return await commentModel.find({ postId: id });
}
export const deleteAllCommentForPost = async (id) => {
    return await commentModel.deleteMany({ postId: id });
}
export const checkGroupExist = async (id) => {
    return await groupModel.findById(id);
}
