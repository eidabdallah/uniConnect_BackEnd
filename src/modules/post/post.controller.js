import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { addLikeToPost, checkPostExist, createPostData, getFriendsIds, getGroupIds, getPostsByUserAndFriends, isPostLikedByUser, removeLikeFromPost } from "./post.service.js";

export const createPost = async (req, res, next) => {
    req.body.userId = req.user._id;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.APPNAME}/post/${req.user.universityId}`
        });
        req.body.image = { secure_url, public_id };
    }
    await createPostData(req.body);
    const response = new AppResponse('create post successfully', null, 201);
    return globalSuccessHandler(response, req, res);
}
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
    if (alreadyLiked) {
        await removeLikeFromPost(id, userId);
    } else {
        await addLikeToPost(id, userId);
    }
    const response = new AppResponse("Post liked successfully", null, 200);
    return globalSuccessHandler(response, req, res);
};
