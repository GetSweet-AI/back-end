import express from "express";
import { deleteBrandEngagement, getBrandManagements, saveBrandEngagement } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

router.route("/save-brand-engagement").post(authenticateUser,saveBrandEngagement);
router.route("/brand-engagements").get(authenticateUser,getBrandManagements);
router.route("/brand-engagements/:id").delete(deleteBrandEngagement)

export default router;

  