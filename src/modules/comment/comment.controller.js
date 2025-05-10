import { AppError } from "../../utils/AppError.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { addLikeToComment, checkPostExist, createCommentData, isCommentLikedByUser, removeLikeFromComment } from "./comment.service.js";

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
    const response = new AppResponse('create comment successfully', null, 201);
    return globalSuccessHandler(response, req, res);
}
export const likeComment = async (req, res, next) => {
    const userId = req.user._id;
    const { postId , commentId } = req.params;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError("Post not found", 404));
    const alreadyLiked = await isCommentLikedByUser(commentId, userId);
    let message;
    if (alreadyLiked) {
        await removeLikeFromComment(commentId, userId);
        message = "Like removed successfully";
    } else {
        await addLikeToComment(commentId, userId);
        message = "comment liked successfully";
    }
    const response = new AppResponse(message, null, 200);
    return globalSuccessHandler(response, req, res);
};
export const deleteComment = async(req , res , next)=>{

};
export const updateComment = async(req , res , next)=>{

};