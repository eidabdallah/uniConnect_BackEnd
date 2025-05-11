import { Router } from "express";
import * as controller from "./post.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.middleware.js";
import { allUsers } from "./post.role.js";
import { createPostSchema, deletePostSchema, getPostByIdSchema, likePostSchema, updatePostSchema } from "./post.validation.js";
import commentRouter from '../comment/comment.router.js';
const router = Router();
router.use('/:postId/comment', commentRouter);
router.post('/', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(createPostSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.createPost));
router.get('/', asyncHandler(auth(allUsers)), asyncHandler(controller.getHomeFeed));
router.get('/:id', asyncHandler(validation(getPostByIdSchema)),asyncHandler(auth(allUsers)), asyncHandler(controller.getPostById));
router.patch('/:id', asyncHandler(validation(likePostSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.likePost));
router.delete('/:id', asyncHandler(validation(deletePostSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.deletePost));
router.patch('/update/:id', fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(updatePostSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.updatePost));

export default router;