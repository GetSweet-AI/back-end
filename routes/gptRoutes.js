import express from "express";
import { generateBlogPost, generateNewCaption, generateTargetAudienceOptions } from "../controllers/gptController.js";
const router = express.Router();

router.post('/generate-blog-post', generateBlogPost);
router.post('/new-caption', generateNewCaption);
router.post('/generate-ta-options', generateTargetAudienceOptions);
export default router;

  