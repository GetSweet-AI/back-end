import { StatusCodes } from "http-status-codes";
import BrandEngagement from "../model/BrandEngagement.js";
import FeedPosts from "../model/FeedPosts.js";
import { badRequestError, notFoundError} from "../errors/index.js";
import User from "../model/User.js";

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
    const updatedUser =  await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { availableTokens: -1 } },
      { new: true }
    );
    res.status(StatusCodes.CREATED).json({ brandEngagement,updatedUser });
  } catch (error) {
    // Handle the error within the catch block
    // console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};

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

const getBrandEngagementById = async (req,res)=>{
  const { id } = req.params;

  try {
    const brandEngagement = await BrandEngagement.findById(id);

    if (!brandEngagement) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "brandEngagement not found" });
    }

    res.status(StatusCodes.OK).json({ brandEngagement });
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

const updateBrandEngagementPostFeed = async (req,res)=>{
  //To-do
  try {
    const { feedPostId} = req.body;
    const { id } = req.params;

    // Update user information
    const updatedBrandEngagement = await BrandEngagement.findOneAndUpdate(
      { _id: id },
      { $set: { feedPostId } },
      { returnOriginal: false }
    );

    res.status(200).json({ brandEngagement: updatedBrandEngagement });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getFeedPosts = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Your logic to retrieve brand engagements based on the user ID
    const feedPosts = await FeedPosts.find({ createdBy: userId });

    // Return the brand engagements as a response
    res.status(200).json({ feedPosts });
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
const deleteFeedPost = async (req, res) => {
  const { id: brandId } = req.params

  const feedPosts = await FeedPosts.findOne({ _id: brandId })

  if (!feedPosts) {
    throw new notFoundError(`No feedPosts with id :${brandId}`)
  }

  // checkPermissions(req.user, feedPosts.createdBy)

  await feedPosts.remove()

  res.status(StatusCodes.OK).json({ msg: 'Success! feedPosts removed' })
}

const saveFeedPost = async (req, res) => {
  try {
    const { Date, MediaUrl, Caption, Accounts,BrandEngagementID } = req.body;

    if (!Date || !MediaUrl || !Caption || !Accounts || !BrandEngagementID) {
      throw new badRequestError('Please provide all values');
    }
    
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new badRequestError('User ID not found');
    }
    
    const feedPosts = await FeedPosts.create({
      Date,
      MediaUrl,
      Caption,
      Accounts,
      BrandEngagementID,
      createdBy: userId // Set createdBy to the userId
    });

   

    res.status(StatusCodes.CREATED).json({ feedPosts });
  } catch (error) {
    // Handle the error within the catch block
    // console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};



export { updateBrandEngagementPostFeed,getBrandEngagementById,saveBrandEngagement,getBrandManagements, deleteBrandEngagement,saveFeedPost, getFeedPosts,deleteFeedPost };
