// controllers/imageController.js

import BrandEngagement from '../model/BrandEngagement.js';
import { uploadImage, uploadMultipleImages } from '../services/imageService.js';

const uploadImageController = async (req, res) => {
  try {
    const brandEId = req.body.brandEId;
    const url = await uploadImage(req.body.image);

    // Update user information
    await BrandEngagement.findOneAndUpdate(
      { _id: brandEId },
      {
        $push: { attachedPicture: url },
      },
      { returnOriginal: false }
    );

    res.send(url);
  } catch (err) {
    res.status(500).send(err);
  }
};
const uploadMultipleImagesController = async (req, res) => {
  // try {
  //   const brandEId = req.body.brandEId;
  //   const url = await uploadMultipleImages(req.body.image);

  //   // // Update user information
  //   // await BrandEngagement.findOneAndUpdate(
  //   //   { _id: brandEId },
  //   //   {
  //   //     $set: { attachedPicture: url },
  //   //   },
  //   //   { returnOriginal: false }
  //   // );

  //   res.json({ url });
  // } catch (err) {
  //   res.status(500).send(err);
  // }
  const { image } = req.body;

  try {
    const imageUrls = await uploadMultipleImages(image);

    res.json({ success: true, imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


export { uploadImageController,uploadMultipleImages };
