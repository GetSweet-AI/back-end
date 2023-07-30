import express from "express"
import { cancelSubscription, cancelSubscriptionByCustomerId, checkSubscriptionStatus, checkSubscriptionStatusByCustOmerID, getSubscriptionById, getSubscriptions, getSubscriptionsByCustomerId, hasSubscription } from "../controllers/stripeController.js";

const router = express.Router();

router.get('/subscriptions', getSubscriptions);
router.get('/has-subscription/:customerId', hasSubscription);
router.post('/cancel-subscription', cancelSubscription);
// router.get('/subscriptions', getSubscriptions);
router.get('/subscriptions/:subscriptionId', getSubscriptionById);
router.get('/subscriptions/customer/:customerId', getSubscriptionsByCustomerId);

router.post('/cancel-subscription/:customerId', cancelSubscriptionByCustomerId);
router.get('/:subscriptionId/status', checkSubscriptionStatus);
router.get('/:customerId/status', checkSubscriptionStatusByCustOmerID);

export default router;
