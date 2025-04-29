import { roles } from "../../middleware/auth.middleware.js";

export const allUsers = [roles.SUPERADMIN, roles.ADMIN, roles.DOCTOR, roles.STUDENT];