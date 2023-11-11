// routes/imageRoutes.js

import express from 'express';
import { uploadImageController,uploadMultipleImages } from '../controllers/imageController.js';

const router = express.Router();
import multer from 'multer';
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/uploadImage', uploadImageController);
router.post('/api/uploadMultipleImages',upload.array('images'), uploadMultipleImages);

export default router;
