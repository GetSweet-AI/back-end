import express from "express"
import { cancelSubscription, cancelSubscriptionByCustomerId, checkSubscriptionStatus, checkSubscriptionStatusByCustOmerID, getAllPlanInfos , getSubscriptionById, getSubscriptions, getSubscriptionsByCustomerId, hasSubscription, updatePlan } from "../controllers/stripeController.js";

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

// POST /update-plan
router.post('/update-plan', updatePlan);

router.get('/plans', getAllPlanInfos );

export default router;
