import express from "express";
const router = express.Router();
import * as userController from "../controllers/user.controller.js";
import { validateRegisterUser, validateLoginUser } from "../validators/user.validator.js";
import { verifyToken } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";

router.post("/register", validateRegisterUser, userController.registerUser);
router.post("/login", validateLoginUser, userController.loginUser);
router.post("/refresh", userController.refreshToken);
router.post("/logout", userController.logout);
router.get("/me", verifyToken, authorize("customer", "admin"), userController.getMe);

export default router;