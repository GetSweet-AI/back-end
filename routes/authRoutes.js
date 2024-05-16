import express from "express"

const router = express.Router();
// import authenticateUser from "../middleware/auth.js";

import { register, login,
     updateEmail, sendVerificationCode,
      verifyEmail, resetPassword, 
      deleteUser, getUserById,
       confirmUserEmail, sendEmailVerification, updateAvailableTokens, authenticateUser, sendWelcomeMessage, subscribeToNewsLetter, updateNameAndCompany, updateNotificationMessage, disableFirstLogin
       
     } from "../controllers/authController.js";
import checkTrialStatus from "../middleware/checkTrialStatus.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.put('/update/:userId', updateEmail);
router.put('/update-notification-message/:userId', updateNotificationMessage);
router.put('/update-general-info/:userId', updateNameAndCompany);
router.put('/update-available-tokens/:userId', updateAvailableTokens);
router.route("/send-verification-code").post(sendVerificationCode);
router.route("/send-welcome-email").post(sendWelcomeMessage);

// Route for verifying email
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);
router.get('/users/:userId', getUserById);
router.get('/check-free-trial/:userId', checkTrialStatus);

router.delete('/users/:userId',deleteUser);

// Route to confirm user email
router.put("/users/confirm-email/:userId", confirmUserEmail);
router.post('/users/:userId/send-email-verification', sendEmailVerification);

//Google auth
router.post('/googlelogin', authenticateUser);

//Subscribe to news letter
router.route("/subscribe").post(subscribeToNewsLetter);

// Switch firstLogin property
router.put("/users/disable-first-login/:userId", disableFirstLogin);

export default router;
