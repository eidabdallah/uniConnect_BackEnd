import { AppError } from '../../utils/AppError.js';
import { AppResponse, globalSuccessHandler } from './../../utils/responseHandler.js';
import { checkPostExist, checkPostSaved, deleteSavedPost, getPostSavedUser, savedPost } from './savedPost.service.js';


export const toggleSavedPost = async (req, res, next) => {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError('Post not found', 404));

    const alreadySaved = await checkPostSaved(postId, userId);

    if (alreadySaved) {
        await deleteSavedPost(userId, postId);
        const response = new AppResponse('Post unsaved successfully', null, 200);
        return globalSuccessHandler(response, req, res);
    } else {
        await savedPost(postId, userId);
        const response = new AppResponse('Post saved successfully', null, 201);
        return globalSuccessHandler(response, req, res);
    }
};

export const getSavedPosts = async (req, res, next) => {
    const userId = req.user._id;
    const posts = await getPostSavedUser(userId);
    const response = new AppResponse('Fetched saved posts', posts, 200, 'posts');
    return globalSuccessHandler(response, req, res);
};

export const isPostSaved = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user._id;
    const post = await checkPostExist(postId);
    if (!post) return next(new AppError('Post not found', 404));
    const saved = await checkPostSaved(postId, userId);
    const response = new AppResponse('Check complete', { isSaved: !!saved }, 200 , 'saved');
    return globalSuccessHandler(response, req, res);
};
