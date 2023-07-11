import express from "express"
import { getSubscriptions, hasSubscription } from "../controllers/stripeController.js";

const router = express.Router();

router.get('/subscriptions', getSubscriptions);
router.get('/has-subscription/:customerId', hasSubscription);
// router.get('/subscriptions', getSubscriptions);

export default router;
