import commentModel from "../../../DB/model/comment.model.js";
import postModel from "../../../DB/model/post.model.js";

export const createCommentData = async (commentData) => {
    return await commentModel.create(commentData);
};
export const checkPostExist = async (postId) => {
    return await postModel.findById(postId).populate('userId', 'slug userName');
};
export const checkCommentExist = async (commentId) => {
    return await commentModel.findById(commentId).populate('userId', 'slug userName');
};

export const isCommentLikedByUser = async (commentId, userId) => {
    const comment = await commentModel.findOne({ _id: commentId, likes: userId });
    return !!comment;
};
export const addLikeToComment = async (commentId, userId) => {
    return await commentModel.updateOne(
        { _id: commentId },
        { $addToSet: { likes: userId } }
    );
};

export const removeLikeFromComment = async (commentId, userId) => {
    return await commentModel.updateOne(
        { _id: commentId },
        { $pull: { likes: userId } }
    );
};
export const deleteComemnt = async (id) => {
    return await commentModel.findByIdAndDelete(id);
}