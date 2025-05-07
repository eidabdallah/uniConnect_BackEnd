import { Router } from "express";
import * as controller from "./friend.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { allUsers } from './friend.role.js';
import { validation } from "../../middleware/validation.middleware.js";
import { createFriendRequestSchema, removeFriendOrCancelRequestSchema, respondToFriendRequestSchema } from "./friend.validation.js";

const router = Router();

router.get('/', asyncHandler(auth(allUsers)), controller.getUserFriends);
router.post('/', asyncHandler(validation(createFriendRequestSchema)), asyncHandler(auth(allUsers)), controller.createFriendRequest);
router.get('/request', asyncHandler(auth(allUsers)), controller.getFriendRequests);
router.patch('/', asyncHandler(validation(respondToFriendRequestSchema)), asyncHandler(auth(allUsers)), controller.respondToFriendRequest);
router.delete('/' , asyncHandler(validation(removeFriendOrCancelRequestSchema)), asyncHandler(auth(allUsers)), controller.removeFriendOrCancelRequest);



export default router;