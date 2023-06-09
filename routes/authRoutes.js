import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

import { register, login, updateUser, sendVerificationCode } from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update-profile").patch(authenticateUser, updateUser);
router.post("/send-verification-code", sendVerificationCode);
export default router;
