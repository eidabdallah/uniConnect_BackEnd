import notificationModel from "../../../DB/model/notification.model.js";
import { AppError } from "../../utils/AppError.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { getIO } from "../../utils/socket.js";
import { addLikeToPost, checkGroupExist, checkPostComment, checkPostExist, createPostData, deleteAllCommentForPost, deletedPost, getFriendsIds, getGroupIds, getPostsByUserAndFriends, getPostWithComments, isPostLikedByUser, removeLikeFromPost, updatePostData } from "./post.service.js";

export const createPost = async (req, res, next) => {
    req.body.userId = req.user._id;
    if (req.body.groupId) {
        const group = await checkGroupExist(req.body.groupId);
        if (!group) {
            return next(new AppError("Group not found", 404));
        }
        if (group.type === 'private') {
            const isMember = group.members.some(member => member.toString() === req.user._id.toString());
            if (!isMember) {
                return next(new AppError("You must be a group member to post", 403));
            }
        }
    }
    if (req.files && req.files.length > 0) {
        const images = [];
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${process.env.APPNAME}/post/${req.user.universityId}`
            });
            images.push({ secure_url, public_id });
        }
        req.body.image = images;
    }
    await createPostData(req.body);
    const friendIds = await getFriendsIds(req.user._id);
    const io = getIO();
    if (friendIds.length > 0) {
        await Promise.all(
            friendIds.map(async friendId => {
                const notification = await notificationModel.create({
                    userId: friendId,
                    content: `${req.user.userName} created a new post`,
                    notificationType: 'post'
                });

                io.to(friendId.toString()).emit('newNotification', notification);

                return notification;
            })
        );
    }
    const response = new AppResponse('create post successfully', null, 201);
    return globalSuccessHandler(response, req, res);
}
export const getPostById = async (req, res, next) => {
    const { id } = req.params;
    const post = await getPostWithComments(id);
    if (!post) return next(new AppError("Post not found", 404));

    const response = new AppResponse("Post fetched successfully", post, 200, 'post');
    return globalSuccessHandler(response, req, res);
};

export const getHomeFeed = async (req, res, next) => {
    const userId = req.user._id;
    const friendIds = await getFriendsIds(userId);
    const groupIds = await getGroupIds(userId);
    const userAndFriendsIds = [userId, ...friendIds, ...groupIds];
    const posts = await getPostsByUserAndFriends(userAndFriendsIds);
    const response = new AppResponse("Home feed fetched", posts, 200, 'posts');
    return globalSuccessHandler(response, req, res);
};
export const likePost = async (req, res, next) => {
    const userId = req.user._id;
    const { id } = req.params;
    const post = await checkPostExist(id);
    if (!post) return next(new AppError("Post not found", 404));
    const alreadyLiked = await isPostLikedByUser(id, userId);
    let message;
    if (alreadyLiked) {
        await removeLikeFromPost(id, userId);
        message = "Like removed successfully";
    } else {
        await addLikeToPost(id, userId);
        message = "Post liked successfully";
        if (post.userId.toString() !== userId.toString()) {
            const notification = await notificationModel.create({
                userId: post.userId,
                content: `${req.user.userName} liked your post`,
                notificationType: 'like',
            });
            const io = getIO();
            io.to(post.userId.toString()).emit('newNotification', notification);
        }
    }

    const response = new AppResponse(message, null, 200);
    return globalSuccessHandler(response, req, res);
};
export const deletePost = async (req, res, next) => {
    const { id } = req.params; // post id
    const post = await checkPostExist(id);
    if (!post) return next(new AppError("Post not found", 404));
    if (!post.userId.equals(req.user._id))
        return next(new AppError("Unauthorized", 403));
    const comments = await checkPostComment(id);
    for (const comment of comments) {
        if (comment.image) {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
    }
    await deleteAllCommentForPost(id);
    if (post.image?.length > 0) {
        for (const image of post.image) {
            if (image?.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }
    }
    await deletedPost(id);
    const response = new AppResponse("post delete Successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
export const updatePost = async (req, res, next) => {
    const { id } = req.params; // post id
    const post = await checkPostExist(id);
    if (!post) return next(new AppError("Post not found", 404));
    if (!post.userId.equals(req.user._id))
        return next(new AppError("Unauthorized", 403));
    if (req.files && req.files.length > 0) {
        if (post.image?.length > 0) {
            for (const image of post.image) {
                if (image?.public_id) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
            }
        }
        const image = [];
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                folder: `${process.env.APPNAME}/post/${req.user.universityId}`
            });
            image.push({ secure_url, public_id });
        }
        req.body.image = image;
    }
    const updatedPost = await updatePostData(id, req.body);
    const response = new AppResponse("Post updated successfully", updatedPost, 200, 'post');
    return globalSuccessHandler(response, req, res);
};