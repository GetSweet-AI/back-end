import express from "express";
import { deleteBrandEngagement, deleteFeedPost, getBrandEngagementById, getBrandManagements, getFeedPosts, saveBrandEngagement, saveFeedPost, updateBrandEngagementPostFeed } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

router.route("/save-brand-engagement/:userId").post(saveBrandEngagement);
router.route("/save-feed-post/:userId").post(saveFeedPost);
router.route("/brand-engagements/:userId").get(getBrandManagements);
router.route("/brand-engagement/:id").get(getBrandEngagementById);
router.route("/feed-posts/:userId").get(getFeedPosts);
router.route("/brand-engagements/:id").delete(deleteBrandEngagement)
router.route("/feed-posts/:id").delete(deleteFeedPost)

router.put('/update-brand-engagement/:id', updateBrandEngagementPostFeed);

export default router;

  