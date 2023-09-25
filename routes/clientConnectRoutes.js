import express from "express";
import { checkConnectLinkExistsByBrandEngagementID, getClientConnects, getConnectURLByBEID, saveClientConnect } from "../controllers/ClientConnectController.js";
const router = express.Router();

router.route("/save-client-connect/:userId").post(saveClientConnect);
router.route("/client-connects/:userId").get(getClientConnects);
router.route("/client-connect/:BrandEngagementID").get(getConnectURLByBEID);
// Define the endpoint route
router.get('/check-connect-link-exists/:BrandEngagementID', checkConnectLinkExistsByBrandEngagementID);


export default router;
