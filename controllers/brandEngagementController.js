import { StatusCodes } from "http-status-codes";
import BrandEngagement from "../model/BrandEngagement.js";
import FeedPosts from "../model/FeedPosts.js";
import { badRequestError, notFoundError} from "../errors/index.js";
import User from "../model/User.js";
import Archive from "../model/Archive.js";

const saveBrandEngagement = async (req, res) => {
  try {
    const { lifeCycleStatus,endDate,startDate,Timezone, CompanySector, BrandTone, TargetAudience, postContent, WebSite, BrandName,PostType,language,days } = req.body;

    if (!CompanySector || !BrandTone || !BrandName) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'CompanySector, BrandTone, and BrandName are required fields' });
    }
    
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new badRequestError('User ID not found');
    }
    //  // Check if BrandName already exists
    //  const existingBrand = await BrandEngagement.findOne({ BrandName });
    //  if (existingBrand) {
    //    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'BrandName must be unique' });
    //  }

     

    const brandEngagement = await BrandEngagement.create({
      Timezone,
      CompanySector,
      BrandTone,
      postContent,
      WebSite,
      BrandName,
      endDate,
      startDate,
      lifeCycleStatus,
      PostType,
      language,
      days,
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

const cloneBrandEngagement = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the userId from the route parameter
    const beId = req.query.beId; // Extract the brand engagement ID from the query parameter

    if (!beId) {
      throw new Error('Brand Engagement ID not found');
    }

    const brandEngagement = await BrandEngagement.findById(beId);

    if (!brandEngagement) {
      throw new Error('Brand engagement not found');
    }

    const cloneBrandEngagement = await BrandEngagement.create({
      Timezone: brandEngagement.Timezone,
      CompanySector: brandEngagement.CompanySector,
      BrandTone: brandEngagement.BrandTone,
      postContent: brandEngagement.postContent,
      WebSite: brandEngagement.WebSite,
      BrandName: brandEngagement.BrandName + " -" + " Copy",
      createdBy: userId // Set createdBy to the userId
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { availableTokens: -1 } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json({ cloneBrandEngagement, updatedUser });
  } catch (error) {
    // Handle the error within the catch block
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};


const getBrandManagements = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new Error('User ID not found');
    }

    const PAGE_SIZE = 3;
    const page = parseInt(req.query.page || "0");
    const brandEngagementsData = await BrandEngagement.find({ createdBy: userId })
    const total = await BrandEngagement.countDocuments({ createdBy: userId });

    
    // Your logic to retrieve brand engagements based on the user ID
    const brandEngagements = await BrandEngagement.find({ createdBy: userId }).limit(PAGE_SIZE)
    .sort({ createdAt: -1 })
    .skip(PAGE_SIZE * page);

    // Return the brand engagements as a response
    res.status(200).json({    total,totalPages: Math.ceil(total / PAGE_SIZE),brandEngagements });
  } catch (error) {
    next(error);
  }
};

const getBrandEngByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Extract the userId from the route parameter

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Get current date in ISO format
    const currentDate = new Date().toISOString();

    // Query for brand engagements where endDate is empty or greater than or equal to the current date
    const brandEngagements = await BrandEngagement.find({ 
      createdBy: userId,
      // $or: [
      //   { endDate: { $exists: false } }, // endDate is empty
      //   { endDate: { $gte: currentDate } } // endDate is in the future
      // ]
    });

    const total = await BrandEngagement.countDocuments({ createdBy: userId });
    
    // Return the brand engagements as a response
    res.status(200).json({ total, brandEngagements });
  } catch (error) {
    next(error);
  }
};

//by user id and brand engagement ID
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
const updateBrandEngagementCampaign = async (req,res)=>{
  //To-do
  try {
    const { id } = req.params;
    const { campaignTitle } = req.body;

    // Update user information
    const updatedBrandEngagement = await BrandEngagement.findOneAndUpdate(
      { _id: id },
      { $set: { campaignTitle:campaignTitle } },
      { returnOriginal: false }
    );

    res.status(200).json({ brandEngagement: updatedBrandEngagement });

  } catch (error) {
    console.error('Error updating brand engagement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const updatePostFeedCaption = async (req,res)=>{
  //TO-DO : update caption by feedPostId and switch toBeRevised to true
  try {
    const { feedPostId} = req.params;
    const { NewCaption} = req.body;

    // Update user information
    const updatedFeedPost = await FeedPosts.findOneAndUpdate(
      { _id: feedPostId },
      { $set: { Caption:NewCaption,toBeRevised:true } },
      { returnOriginal: false }
    );

    res.status(200).json({ NewFeedPost: updatedFeedPost });

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

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    const currentDate = new Date();
    const startOfDay = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const endOfMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

    const total = await FeedPosts.countDocuments({
      createdBy: userId,
      toBeArchived: false,
      Date: { $gte: startOfDay, $lte: endOfMonth }
    });

    // Your logic to retrieve brand engagements based on the user ID
    const feedPosts = await FeedPosts.find({
      createdBy: userId,
      toBeArchived: false,
      Date: { $gte: startOfDay, $lte: endOfMonth }
    })
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page)
      .sort({ createdAt: -1 })
      .sort({ Date: +1 }); // Sort by Date in descending order

    // Return the brand engagements as a response
    res.status(200).json({ total, totalPages: Math.ceil(total / PAGE_SIZE), feedPosts });
  } catch (error) {
    next(error);
  }
};

const getFeedPostByBEId = async (req, res, next) => {
  try {
    const brandEngagementID = req.params.brandEngagementID; // Extract the userId from the route parameter

    const currentDate = new Date();
    const startOfDay = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    const endOfMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

    const total = await FeedPosts.countDocuments({ BrandEngagementID: brandEngagementID,toBeArchived:false});
    // const total = await FeedPosts.countDocuments({ BrandEngagementID: brandEngagementID,toBeArchived:false,Date: { $gte: startOfDay, $lt: endOfMonth }  });

    // Your logic to retrieve brand engagements based on the BrandEngagementID
    // const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagementID,toBeArchived:false}).sort({Date:-1})
    const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagementID,toBeArchived:false,Date: { $gte: startOfDay, $lt: endOfMonth } }).sort({Date:+1})

     // Return the brand engagements as a response
     res.status(200).json({total,feedPosts });
  } catch (error) {
    next(error);
  }
};
// const getFeedPostByBEId = async (req, res, next) => {
//   try {
//     const brandEngagementID = req.params.brandEngagementID; // Extract the userId from the route parameter

//     const currentDate = new Date();
//     const startOfDay = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
//     const endOfMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}`;

//     const PAGE_SIZE = 12;
//     const page = parseInt(req.query.page || "0");

//     const total = await FeedPosts.countDocuments({ BrandEngagementID: brandEngagementID,toBeArchived:false});
//     // const total = await FeedPosts.countDocuments({ BrandEngagementID: brandEngagementID,toBeArchived:false,Date: { $gte: startOfDay, $lt: endOfMonth }  });

//     // Your logic to retrieve brand engagements based on the BrandEngagementID
//     const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagementID,toBeArchived:false}).limit(PAGE_SIZE)
//     .skip(PAGE_SIZE * page).sort({Date:-1})
//     // const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagementID,toBeArchived:false,Date: { $gte: startOfDay, $lt: endOfMonth } }).limit(PAGE_SIZE)
//     // .skip(PAGE_SIZE * page).sort({Date:+1})

//      // Return the brand engagements as a response
//      res.status(200).json({total,totalPages: Math.ceil(total / PAGE_SIZE),feedPosts });
//   } catch (error) {
//     next(error);
//   }
// };

const deleteBrandEngagement = async (req, res) => {
  const { id: brandId } = req.params

  const brandEngagement = await BrandEngagement.findOne({ _id: brandId })

  if (!brandEngagement) {
    throw new notFoundError(`No brandEngagement with id :${brandId}`)
  }

  const archiveBrandEngagement = await Archive.create({
    Timezone: brandEngagement.Timezone,
    CompanySector: brandEngagement.CompanySector,
    BrandTone: brandEngagement.BrandTone,
    postContent:brandEngagement.postContent,
    WebSite: brandEngagement.WebSite,
    BrandName: brandEngagement.BrandName,
    createdBy: brandEngagement.createdBy // Set createdBy to the userId
  });

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
 // Find the feedPost by its ID and update the isArchived property to true
 const result = await FeedPosts.updateOne(
  { _id: brandId },
  { $set: { toBeArchived: true } }
);

if (result.matchedCount === 0) {
  throw new Error(`No feedPost with id: ${brandId}`);
}
  
  res.status(StatusCodes.OK).json({ msg: 'Success! feedPost archived' })
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

const updatedBERelatedPostsStatus = async (req,res) => {

    const { brandEngagementId } = req.params;
  
    try {
      const brandEngagement = await BrandEngagement.findById(brandEngagementId);
  
      if (!brandEngagement) {
        return res.status(404).json({ message: 'Brand Engagement not found.' });
      }
  
      const updatedStatus = brandEngagement.relatedPostsStatus === 'Posts generating...'
        ? 'Posts are ready'
        : 'Posts generating...';
  
      brandEngagement.relatedPostsStatus = updatedStatus;
      await brandEngagement.save();
  
      return res.json({ message: 'Status updated successfully.', brandEngagement });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred while updating status.' });
    }
}

async function getCampaignTitlesByBrandEngagementId(req, res) {
  const { brandEngagementId } = req.params;

  try {
    const campaignTitles = await BrandEngagement.distinct('campaignTitle', { _id: brandEngagementId });
    
    // Create an array of objects similar to statusOptions
    const formattedCampaigns = campaignTitles.map(title => ({ id: title, label: title, checked: false }));

    res.json(formattedCampaigns);
  } catch (error) {
    console.error('Error retrieving unique campaign titles:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


const applyMediaTypeFilter = async (req, res, next) => {
  try {
    const brandEngagementID = req.params.brandEngagementID; // Extract the userId from the route parameter
    const { isImage, isVideo } = req.query;

    // Construct the filter based on the media type
    const mediaTypeFilter = {};
    if (isImage === 'true' && isVideo === 'true') {
      mediaTypeFilter['$or'] = [
        { MediaUrl: { $regex: /\.(jpeg|jpg|png)$/i } },
        { MediaUrl: { $regex: /\.(mp4)$/i } }
      ];
    } else if (isImage === 'true') {
      mediaTypeFilter['MediaUrl'] = { $regex: /\.(jpeg|jpg|png)$/i };
    } else if (isVideo === 'true') {
      mediaTypeFilter['MediaUrl'] = { $regex: /\.(mp4)$/i };
    }

    // Apply the brandEngagementID and media type filters
    const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagementID, toBeArchived: false, ...mediaTypeFilter })
      .sort({ Date: -1 });

    // Return the filtered feedPosts
    res.status(200).json({ feedPosts });
  } catch (error) {
    next(error);
  }
};


export {applyMediaTypeFilter,getCampaignTitlesByBrandEngagementId,
  updateBrandEngagementCampaign,updatePostFeedCaption,
  getBrandEngByUserId, cloneBrandEngagement,updatedBERelatedPostsStatus,
  getFeedPostByBEId,updateBrandEngagementPostFeed,getBrandEngagementById,
  saveBrandEngagement,getBrandManagements, deleteBrandEngagement,
  saveFeedPost, getFeedPosts,deleteFeedPost };
