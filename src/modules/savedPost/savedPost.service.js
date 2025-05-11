import postModel from './../../../DB/model/post.model.js';
import savedPostModel from './../../../DB/model/savedPost.model.js';
export const checkPostExist = async (postId) => {
    return await postModel.findById(postId);
}
export const checkPostSaved = async (postId, userId) => {
    return await savedPostModel.findOne({ userId, postId });
}
export const savedPost = async (postId, userId) => {
    await savedPostModel.create({ userId, postId });
}
export const getPostSavedUser = async (userId) => {
    return await savedPostModel.find({ userId })
        .populate({
            path: 'postId',
            populate: [{ path: 'userId', select: 'userName' },
            { path: 'comments' }]
        });
}
export const deleteSavedPost = async (userId, postId) => {
    return await savedPostModel.findOneAndDelete({ userId, postId });
}
