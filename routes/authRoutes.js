import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

import { register, login, updateUser, sendVerificationCode, verifyEmail, resetPassword, deleteUser } from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.put('/update/:userId', updateUser);
router.route("/send-verification-code").post(sendVerificationCode);
// Route for verifying email
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

router.route('/users/:userId').delete(deleteUser);

export default router;
