import express from "express";
import { applyMediaTypeFilter, cloneBrandEngagement, deleteBrandEngagement, deleteFeedPost, getBrandEngByUserId, getBrandEngagementById, getBrandManagements, getCampaignTitlesByBrandEngagementId, getExBrandManagements, getFeedPostByBEId, getFeedPosts, saveBrandEngagement, saveFeedPost, updateBrandEngagementCampaign, updateBrandEngagementPostFeed, updatePostFeedCaption, updatedBERelatedPostsStatus } from "../controllers/brandEngagementController.js";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";
import { getTotalClientConnectStatus } from "../controllers/ClientConnectController.js";

router.route("/save-brand-engagement/:userId").post(saveBrandEngagement);
router.route("/clone-brand-engagement/:userId").post(cloneBrandEngagement);
router.route("/save-feed-post/:userId").post(saveFeedPost);
router.route("/brand-engagements/:userId").get(getBrandManagements);
router.route("/brand-engagements-np/:userId").get(getBrandEngByUserId);
router.route("/brand-engagement/:id").get(getBrandEngagementById);
router.route("/brand-engagements-ex").get(getExBrandManagements);
router.route("/feed-posts/:userId").get(getFeedPosts);
router.route("/feed-posts-engagements/:brandEngagementID").get(getFeedPostByBEId);
router.route("/brand-engagements/:id").delete(deleteBrandEngagement)
router.route("/feed-posts/:id").delete(deleteFeedPost)
router.put('/update-campaign/:id', updateBrandEngagementCampaign);


router.route("/brand-engagements/:brandEngagementId/update-status").put(updatedBERelatedPostsStatus)

router.put('/update-brand-engagement/:id', updateBrandEngagementPostFeed);
router.put('/feed-posts/:feedPostId', updatePostFeedCaption);


// Define route for getting total client connect status
router.get('/total-client-connect-status/:userId', getTotalClientConnectStatus);// Define route for getting campaign titles by BrandEngagementId
router.get('/campaign-titles/:brandEngagementId',getCampaignTitlesByBrandEngagementId);

// Route for applying media type filter to feedPosts
router.get('/brandEngagement/:brandEngagementID/filter', applyMediaTypeFilter);

export default router;

  