import express from "express"

const router = express.Router();
// import authenticateUser from "../middleware/auth.js";

import { register, login,
     updateUser, sendVerificationCode,
      verifyEmail, resetPassword, 
      deleteUser, getUserById,
       confirmUserEmail, sendEmailVerification, updateAvailableTokens, authenticateUser, sendNotificationOnPostGenerated, subscribeToNewsLetter
     } from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.put('/update/:userId', updateUser);
router.put('/update-available-tokens/:userId', updateAvailableTokens);
router.route("/send-verification-code").post(sendVerificationCode);
router.route("/send-notification-email").post(sendNotificationOnPostGenerated);

// Route for verifying email
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.get('/users/:userId', getUserById);

router.route('/users/:userId').delete(deleteUser);

// Route to confirm user email
router.put("/users/confirm-email/:userId", confirmUserEmail);
router.post('/users/:userId/send-email-verification', sendEmailVerification);

//Google auth
router.post('/googlelogin', authenticateUser);

//Subscribe to news letter
router.route("/subscribe").post(subscribeToNewsLetter);

export default router;
