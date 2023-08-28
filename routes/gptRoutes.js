import express from "express";
import { generateBlogPost } from "../controllers/gptController.js";
const router = express.Router();

router.post('/generate-blog-post', generateBlogPost);
export default router;

  