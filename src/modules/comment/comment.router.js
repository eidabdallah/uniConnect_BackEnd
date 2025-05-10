import { Router } from "express";
import * as controller from "./comment.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { allUsers } from './comment.role.js';
import { validation } from "../../middleware/validation.middleware.js";
import { fileMimeTypes, fileUpload } from "../../utils/multer.js";
import { createCommentSchema, deleteCommentSchema, likeCommentSchema, updateCommentSchema } from "./comment.validation.js";

const router = Router({ mergeParams: true });

router.post('/' ,fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(createCommentSchema)), asyncHandler(auth(allUsers)) , asyncHandler(controller.addComment));
router.patch('/:commentId', asyncHandler(validation(likeCommentSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.likeComment));
router.delete('/:commentId', asyncHandler(validation(deleteCommentSchema)), asyncHandler(auth(allUsers)), asyncHandler(controller.deleteComment));
router.patch('/update/:commentId' ,fileUpload(fileMimeTypes.image).single('image'), asyncHandler(validation(updateCommentSchema)), asyncHandler(auth(allUsers)) , asyncHandler(controller.updateComment));

export default router;