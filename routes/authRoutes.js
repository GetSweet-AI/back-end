import express from "express"

const router = express.Router();
// import authenticateUser from "../middleware/auth.js";

import { register, login,
     updateEmail, sendVerificationCode,
      verifyEmail, resetPassword, 
      deleteUser, getUserById,
       confirmUserEmail, sendEmailVerification, updateAvailableTokens, authenticateUser, sendWelcomeMessage, subscribeToNewsLetter, updateNameAndCompany
     } from "../controllers/authController.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.put('/update/:userId', updateEmail);
router.put('/update-general-info/:userId', updateNameAndCompany);
router.put('/update-available-tokens/:userId', updateAvailableTokens);
router.route("/send-verification-code").post(sendVerificationCode);
router.route("/send-welcome-email").post(sendWelcomeMessage);

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
