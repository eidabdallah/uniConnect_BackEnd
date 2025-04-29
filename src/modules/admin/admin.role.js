import { roles } from "../../middleware/auth.middleware.js";

export const superAdmin = [roles.SUPERADMIN];
export const adminAndsuperAdmin = [roles.ADMIN, roles.SUPERADMIN];