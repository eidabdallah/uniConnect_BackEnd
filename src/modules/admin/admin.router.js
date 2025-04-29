import { Router } from "express";
import * as controller from "./admin.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { validation } from "../../middleware/validation.middleware.js";
import { adminAndsuperAdmin, superAdmin } from "./admin.role.js";
import { changeConfirmEmailSchema, deleteUserSchema, getUsersSchema, registerAdminSchema, toggleStatusSchema, updateRoleSchema, UserCredentialsSchema } from "./admin.validation.js";
const router = Router();

router.get('/', asyncHandler(validation(getUsersSchema)) , asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.getAllUsersByRole));
router.post('/' , asyncHandler(validation(registerAdminSchema)) , asyncHandler(auth(superAdmin)) , asyncHandler(controller.createAdmin));
router.delete('/:id', asyncHandler(validation(deleteUserSchema)), asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.deleteUser));
router.patch('/role/:id', asyncHandler(validation(updateRoleSchema)), asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.updateRole));
router.patch('/cEmail/:id', asyncHandler(validation(changeConfirmEmailSchema)), asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.changeConfirmEmail));
router.patch('/resetInfo/:id', asyncHandler(validation(UserCredentialsSchema)), asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.adminResetUserCredentials));
router.patch('/:id', asyncHandler(validation(toggleStatusSchema)), asyncHandler(auth(adminAndsuperAdmin)), asyncHandler(controller.toggleStatus));

export default router;