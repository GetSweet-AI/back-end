// Import necessary modules using ES module syntax
import cloudinary from "cloudinary";
import dotenv from "dotenv";
// Assuming you have process.env.CLOUD_NAME, process.env.API_KEY, and process.env.API_SECRET set

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

// Define uploadImage as an async function
const uploadImage = async (image) => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, opts);
    if (result && result.secure_url) {
      console.log(result.secure_url);
      return result.secure_url;
    }
  } catch (error) {
    console.log(error.message);
    throw { message: error.message };
  }
};

// Export the uploadImage function
export { uploadImage };

// Define uploadMultipleImages as an async function
export async function uploadMultipleImages(images) {
  try {
    const uploads = images.map(async (base) => await uploadImage(base));
    const values = await Promise.all(uploads);
    return values;
  } catch (err) {
    throw err;
  }
}
