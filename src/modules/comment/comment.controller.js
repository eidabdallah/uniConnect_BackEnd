import notificationModel from "../../../DB/model/notification.model.js";
import { AppError } from "../../utils/AppError.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { getIO } from "../../utils/socket.js";
import { addLikeToComment, checkCommentExist, checkPostExist, createCommentData, deleteComemnt, isCommentLikedByUser, removeLikeFromComment } from "./comment.service.js";

export const addComment = async (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.postId = req.params.postId;
    const post = await checkPostExist(req.body.postId);
    if (!post) return next(new AppError("Post not found", 404));
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/${req.params.postId}/comment`
        });
        req.body.image = { secure_url, public_id };
    }
    await createCommentData(req.body);
    if (!req.user._id.equals(post.userId)) {
        const notification = await notificationModel.create({
            userId: post.userId._id,
            content: `${req.user.userName} Comment on your post`,
            notificationType: 'Comment'
        });

        const io = getIO();
        io.to(post.userId.slug).emit('newNotification', notification);
    }
    const response = new AppResponse('create comment successfully', null, 201);
    return globalSuccessHandler(response, req, res);
}
export const likeComment = async (req, res, next) => {
    const userId = req.user._id;
    const { postId, commentId } = req.params;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError("Post not found", 404));
    const comment = await checkCommentExist(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    const alreadyLiked = await isCommentLikedByUser(commentId, userId);
    let message;
    if (alreadyLiked) {
        await removeLikeFromComment(commentId, userId);
        message = "Like removed successfully";
    } else {
        await addLikeToComment(commentId, userId);
        if (!userId.equals(comment.userId._id)) {
            const notification = await notificationModel.create({
                userId: comment.userId._id,
                content: `${req.user.userName} liked your comment`,
                notificationType: 'Like'
            });

            const io = getIO();
            io.to(comment.userId.slug).emit('newNotification', notification);
        }

        message = "comment liked successfully";
    }
    const response = new AppResponse(message, null, 200);
    return globalSuccessHandler(response, req, res);
};
export const deleteComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError("Post not found", 404));
    const comment = await checkCommentExist(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    if (!post.userId.equals(req.user._id) && !comment.userId.equals(req.user._id))
        return next(new AppError("Unauthorized", 403));

    await deleteComemnt(commentId);
    const response = new AppResponse("comment delete Successfully", null, 200);
    return globalSuccessHandler(response, req, res);

};
export const updateComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError("Post not found", 404));
    const comment = await checkCommentExist(commentId);
    if (!comment) return next(new AppError("Comment not found", 404));
    if (!comment.userId.equals(userId)) {
        return next(new AppError("Unauthorized", 403));
    }
    if (req.file) {
        if (comment.image?.public_id) {
            await cloudinary.uploader.destroy(comment.image.public_id);
        }
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/${postId}/comment`
        });
        comment.image = { secure_url, public_id };
    }
    if (req.body.text) {
        comment.text = req.body.text;
    }
    await comment.save();
    const response = new AppResponse("Comment updated successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
