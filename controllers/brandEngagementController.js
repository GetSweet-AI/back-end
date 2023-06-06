import { StatusCodes } from "http-status-codes";
import BrandEngagement from "../model/BrandEngagement.js";
import { badRequestError, notFoundError} from "../errors/index.js";

// const saveBrandEngagement = async (req, res) => {
//   const { Timezone, CompanySector, BrandTone, TargetAudience,PostType,postContent,WebSite,BrandName } = req.body;

//   if (!Timezone || !CompanySector || !BrandTone | !TargetAudience | !PostType ) {
//     throw new badRequestError('Please provide all values')
//   }
//   req.body.createdBy = req.user.userId
  
//   const brandEngagement = await BrandEngagement.create(req.body)
//   res.status(StatusCodes.CREATED).json({ brandEngagement })
// };
// router.route("/save-brand-engagement/:userId").post(saveBrandEngagement);

const saveBrandEngagement = async (req, res) => {
  try {
    const { Timezone, CompanySector, BrandTone, TargetAudience, PostType, postContent, WebSite, BrandName } = req.body;

    if (!Timezone || !CompanySector || !BrandTone || !TargetAudience || !PostType) {
      throw new badRequestError('Please provide all values');
    }
    
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new badRequestError('User ID not found');
    }
    
    const brandEngagement = await BrandEngagement.create({
      Timezone,
      CompanySector,
      BrandTone,
      TargetAudience,
      PostType,
      postContent,
      WebSite,
      BrandName,
      createdBy: userId // Set createdBy to the userId
    });

    res.status(StatusCodes.CREATED).json({ brandEngagement });
  } catch (error) {
    // Handle the error within the catch block
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};



// const getBrandManagements = async (req, res, next) => {
//   try {
//     const userId = req.user.userId;

//     if (!userId) {
//       throw new Error('User ID not found');
//     }

//     const brandManagements = await BrandEngagement.find({ createdBy: userId });

//     res.status(StatusCodes.OK).json({ brandManagements });
//   } catch (error) {
//     next(error);
//   }
// };
const getBrandManagements = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Your logic to retrieve brand engagements based on the user ID
    const brandEngagements = await BrandEngagement.find({ createdBy: userId });

    // Return the brand engagements as a response
    res.status(200).json({ brandEngagements });
  } catch (error) {
    next(error);
  }
};

const deleteBrandEngagement = async (req, res) => {
  const { id: brandId } = req.params

  const brandEngagement = await BrandEngagement.findOne({ _id: brandId })

  if (!brandEngagement) {
    throw new notFoundError(`No brandEngagement with id :${brandId}`)
  }

  // checkPermissions(req.user, brandEngagement.createdBy)

  await brandEngagement.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! brandEngagement removed' })
}



export { saveBrandEngagement,getBrandManagements, deleteBrandEngagement };
