import express from "express";
import { deleteBrandEngagement, deleteFeedPost, getBrandManagements, getFeedPosts, saveBrandEngagement, saveFeedPost } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

router.route("/save-brand-engagement/:userId").post(saveBrandEngagement);
router.route("/save-feed-post/:userId").post(saveFeedPost);
router.route("/brand-engagements/:userId").get(getBrandManagements);
router.route("/feed-posts/:userId").get(getFeedPosts);
router.route("/brand-engagements/:id").delete(deleteBrandEngagement)
router.route("/feed-posts/:id").delete(deleteFeedPost)

export default router;

  