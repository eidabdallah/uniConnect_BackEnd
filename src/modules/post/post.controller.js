import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { createPostData, getFriendStatus, getUserOwnPosts, getUserProfilePosts } from "./post.service.js";

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
export const getProfilePosts = async (req, res, next) => {
    const userId = req.user._id;
    const profileId = req.params.id || userId;
    if (userId.toString() === profileId.toString()) {
        const posts = await getUserOwnPosts(profileId);
        const response = new AppResponse('Your posts fetched successfully', posts, 200 , 'posts');
        return globalSuccessHandler(response, req, res);
    }
    const friends = await getFriendStatus(userId, profileId);
    const isFriend = friends.length > 0;
    const posts = await getUserProfilePosts(profileId, isFriend);

    const response = new AppResponse('Profile posts fetched successfully', posts, 200, 'posts');
    return globalSuccessHandler(response, req, res);
}