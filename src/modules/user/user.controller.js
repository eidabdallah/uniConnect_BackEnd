import { AppError } from "../../utils/AppError.js";
import cloudinary from "../../utils/cloudinary.js";
import { AppResponse, globalSuccessHandler } from "../../utils/responseHandler.js";
import { checkIdExists, getUserBySlug, getUserFriends, getUserPostsForProfile } from "./user.service.js";

export const getUserProfile = async (req, res, next) => {
  const userId = req.user._id;
  const profileSlug = req.params.slug;

  const user = await getUserBySlug(profileSlug);
  if (!user) return next(new AppError('User not found', 404));
  const isOwner = userId.toString() === user._id.toString();
  const posts = await getUserPostsForProfile(user._id, userId, isOwner);
  const friends = await getUserFriends(user._id);
  const response = new AppResponse('User info fetched successfully', { user, posts, friends }, 200, 'info');
  return globalSuccessHandler(response, req, res);
};

export const updateUserInfo = async (req, res, next) => {
  const { userName, bio } = req.body;
  const user = await checkIdExists(req.user._id);
  if (!user)
    return next(new AppError('user not found', 404));

  if (userName) user.userName = userName;
  if (bio) user.bio = bio;
  await user.save();
  const response = new AppResponse('User information updated successfully', null, 200);
  return globalSuccessHandler(response, req, res);
}
export const updateUserPic = async (req, res, next) => {
  const user = await checkIdExists(req.user._id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  if (!req.file) {
    return next(new AppError('No image provided', 400));
  }
  const currentImage = user.profileImage;
  const defaultImage = 'https://res.cloudinary.com/deylqxzgk/image/upload/c_thumb,w_200,g_face/v1745223326/th_jiostr.jpg';
  if (currentImage && currentImage.secure_url !== defaultImage && currentImage.public_id) {
    await cloudinary.uploader.destroy(currentImage.public_id);
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `${process.env.APPNAME}/profilePicture/${user.universityId}`,
  });
  user.profileImage = { secure_url, public_id };
  await user.save();
  const response = new AppResponse('Profile picture updated successfully', null, 200);
  return globalSuccessHandler(response, req, res);
};

