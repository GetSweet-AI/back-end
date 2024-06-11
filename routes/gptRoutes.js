import express from "express";
import { generatePostContent, generateNewCaption, generateTargetAudienceOptions } from "../controllers/gptController.js";
const router = express.Router();

router.post('/generate-blog-post', generatePostContent);
router.post('/new-caption', generateNewCaption);
router.post('/generate-ta-options', generateTargetAudienceOptions);
export default router;

  