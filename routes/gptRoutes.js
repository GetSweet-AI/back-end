import express from "express";
import { generateBlogPost, generateTargetAudienceOptions } from "../controllers/gptController.js";
const router = express.Router();

router.post('/generate-blog-post', generateBlogPost);
router.post('/generate-ta-options', generateTargetAudienceOptions);
export default router;

  