import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { createPostData, getFriendsIds, getGroupIds, getPostsByUserAndFriends } from "./post.service.js";

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