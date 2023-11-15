import express from "express";
import { cloneBrandEngagement, deleteBrandEngagement, deleteFeedPost, getBrandEngByUserId, getBrandEngagementById, getBrandManagements, getFeedPostByBEId, getFeedPosts, saveBrandEngagement, saveFeedPost, updateBrandEngagementPostFeed, updatePostFeedCaption, updatedBERelatedPostsStatus } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";

router.route("/save-brand-engagement/:userId").post(saveBrandEngagement);
router.route("/clone-brand-engagement/:userId").post(cloneBrandEngagement);
router.route("/save-feed-post/:userId").post(saveFeedPost);
router.route("/brand-engagements/:userId").get(getBrandManagements);
router.route("/brand-engagements-np/:userId").get(getBrandEngByUserId);
router.route("/brand-engagement/:id").get(getBrandEngagementById);
router.route("/feed-posts/:userId").get(getFeedPosts);
router.route("/feed-posts-engagements/:brandEngagementID").get(getFeedPostByBEId);
router.route("/brand-engagements/:id").delete(deleteBrandEngagement)
router.route("/feed-posts/:id").delete(deleteFeedPost)

router.route("/brand-engagements/:brandEngagementId/update-status").put(updatedBERelatedPostsStatus)

router.put('/update-brand-engagement/:id', updateBrandEngagementPostFeed);
router.put('/feed-posts/:feedPostId', updatePostFeedCaption);

export default router;

  