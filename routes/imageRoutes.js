// routes/imageRoutes.js

import express from 'express';
import { deleteImage, uploadImageController,uploadMultipleImages, uploadUserImage } from '../controllers/imageController.js';

const router = express.Router();
import multer from 'multer';
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/api/uploadImage', uploadImageController);
router.post('/api/user-profile', uploadUserImage);
router.post('/api/uploadMultipleImages',upload.array('images'), uploadMultipleImages);
router.delete('/api/delete-image', deleteImage);

export default router;
