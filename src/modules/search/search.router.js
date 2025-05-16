import { Router } from "express";
import * as controller from './search.controller.js';
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auth } from '../../middleware/auth.middleware.js';
import { allUsers } from './search.role.js';

const router = Router();

router.get('/',  asyncHandler(auth(allUsers)), asyncHandler(controller.search));

export default router;
