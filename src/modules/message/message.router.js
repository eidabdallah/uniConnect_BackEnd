import { Router } from 'express';
import * as controller from './message.controller.js';
import { allUsers } from './message.role.js';
import { asyncHandler } from './../../utils/asyncHandler.js';
import { auth } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/send', asyncHandler(auth(allUsers)), asyncHandler(controller.sendMessageController));
router.get('/chat', asyncHandler(auth(allUsers)), asyncHandler(controller.getMessagesController));

export default router;
