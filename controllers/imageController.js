// controllers/imageController.js

import BrandEngagement from '../model/BrandEngagement.js';
import { uploadImage, uploadMultipleImages } from '../services/imageService.js';
// Import necessary modules using ES module syntax
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config()

cloudinary.v2.config({
    cloud_name: 'ddtk9h9bc', 
    api_key: '311952192168776', 
  api_secret: process.env.API_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

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



// Helper function to extract public ID from Cloudinary URL
function extractPublicIdFromUrl(url) {
  const match = url.match(/\/v\d+\/([^/]+)\.(jpg|png|gif|jpeg)/);
  return match ? match[1] : null;
}

//Delete image 
export const deleteImage = async (req, res) => {
  const {  imageUrl } = req.query;
  const {  brandEngagementID } = req.query;

  // Extract the public ID from the provided URL
  const public_id = extractPublicIdFromUrl(imageUrl);

  if (!public_id) {
    return res.status(400).json({ error: 'Invalid imgUrl format' });
  }

  try {
    const brandEngagement = await BrandEngagement.findById(brandEngagementID);
                                 
    if (!brandEngagement) {
      return res.status(404).json({ error: 'BrandEngagement not found' });
    }                             

    const result = await cloudinary.uploader.destroy(public_id);

    const imageUrls = (brandEngagement.attachedPicture).filter((url)=> url !== imageUrl)


    if (result.result === 'ok') {
     
  // Use findOneAndUpdate to update the document
   const updatedBrandEngagement = await BrandEngagement.findOneAndUpdate(
      { _id: brandEngagementID },
      { $set: { attachedPicture: imageUrls } },
      { new: true } // To return the updated document
    );

      res.status(200).json({
        message: `Image with public ID ${public_id} has been deleted from Cloudinary and updated in MongoDB.`,
        brandEngagement: updatedBrandEngagement,
      });

    } else {
      res.status(500).json({ error: 'Failed to delete image.' });
    }

  
    // res.json({ message: 'Image URL deleted successfully', brandEngagement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export { uploadImageController,uploadMultipleImages };
