import express from "express";
import { getBrandManagements, saveBrandEngagement } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

router.route("/save-brand-engagement").post(authenticateUser,saveBrandEngagement);
router.route("/brand-engagements").get(authenticateUser,getBrandManagements);

export default router;

  