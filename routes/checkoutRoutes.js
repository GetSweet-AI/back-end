import express from "express"
import { checkoutController } from "../controllers/checkoutController.js";

const router = express.Router();

router.post('/checkout/:secretKey', checkoutController);

export default router;
