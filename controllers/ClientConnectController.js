import { StatusCodes } from "http-status-codes";
import ClientConnect from "../model/ClientConnect.js";
import BrandEngagement from "../model/BrandEngagement.js";
import FeedPosts from "../model/FeedPosts.js";

const saveClientConnect = async (req, res) => {
    try {
      const { BrandEngagementID,ConnectLinkURL,FacebookConnected,InstagramConnected,TwitterConnected,LinkedInConnected,PinterestConnected,YoutubeConnected,GoogleBusinessConnected,TikTokConnected   } = req.body;
  
      if (!BrandEngagementID) {
        throw new badRequestError('Please provide BrandEngagementID');
      }
      
      const userId = req.params.userId; // Extract the userId from the route parameter
  
      if (!userId) {
        throw new badRequestError('User ID not found');
      }
      
      const clientConnect = await ClientConnect.create({
        BrandEngagementID,
        ConnectLinkURL,
        FacebookConnected,
        InstagramConnected,
        TwitterConnected,
        LinkedInConnected,
        PinterestConnected,
        YoutubeConnected,
        GoogleBusinessConnected,
        TikTokConnected,
        createdBy: userId // Set createdBy to the userId
      });
      res.status(StatusCodes.CREATED).json({ clientConnect });
    } catch (error) {
      // Handle the error within the catch block
      // console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
    }
  };
  
const getClientConnects = async (req, res, next) => {
    try {
      const userId = req.params.userId; // Extract the userId from the route parameter
  
      if (!userId) {
        throw new Error('User ID not found');
      }
  
      // Your logic to retrieve brand engagements based on the user ID
      const clientConnects = await ClientConnect.find({ createdBy: userId });
  
      // Return the brand engagements as a response
      res.status(200).json({ clientConnects });
    } catch (error) {
      next(error);
    }
  };

  const getConnectURLByBEID = async (req,res)=>{
    const { BrandEngagementID } = req.params;

    try {
    
      // Get client connect by brand engagement
      const clientConnect = await ClientConnect.findOne({
        BrandEngagementID: BrandEngagementID,
      })
    
      if (!clientConnect) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "clientConnect not found" });
      }

      res.status(StatusCodes.OK).json(clientConnect)

    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error:error.message });
    }

  }
 
  // Check if the ConnectLinkURL property exists in the clientConnect document
async function checkConnectLinkExistsByBrandEngagementID(req, res) {
  const { BrandEngagementID } = req.params;

  try {
    // Find the clientConnect document by BrandEngagementID
    const clientConnect = await ClientConnect.findOne({ BrandEngagementID });

    if (!clientConnect) {
res.json({ hasConnectLinkURL: false });
    }

    // Check if the ConnectLinkURL property exists
    const hasConnectLinkURL = clientConnect.ConnectLinkURL !== null && clientConnect.ConnectLinkURL !== undefined;

    // Return the result as a JSON response
    res.json({ hasConnectLinkURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function getTotalClientConnectStatus(req, res) {
  const { userId } = req.params; // Assuming userId is passed as a route parameter

  try {
    // Find all BrandEngagements associated with the specified user ID
    const brandEngagements = await BrandEngagement.find({ createdBy: userId });

    if (!brandEngagements || brandEngagements.length === 0) {
      return res.status(404).json({ message: 'No BrandEngagements found for the user' });
    }

    let totalStatus = 0;
    let totalPostsScheduled = 0;
    let totalPostsLive = 0;
    let totalPostsNeedSocial = 0;

    // Iterate through each BrandEngagement
    for (const brandEngagement of brandEngagements) {
      // Find the ClientConnect document associated with the current BrandEngagement
      const clientConnect = await ClientConnect.findOne({ BrandEngagementID: brandEngagement._id });

      if (!clientConnect) {
        continue; // Skip to the next BrandEngagement if no ClientConnect is found
      }

      // Check if at least one specified property is set to "yes" for the current ClientConnect
      const propertiesToCheck = [
        "TwitterConnected",
        "FacebookConnected",
        "YoutubeConnected",
        "InstagramConnected",
        "TikTokConnected",
        "GoogleBusinessConnected",
        "PinterestConnected",
        "LinkedInConnected"
      ];

      const hasAtLeastOneYes = propertiesToCheck.some(property => {
        return clientConnect[property] !== 'no';
      });

      if (hasAtLeastOneYes) {
        totalStatus += 1; // Increment total if at least one property is set to "yes"
      } else {
        // If no connected property is set, count the number of FeedPosts for this BrandEngagement
        const postsNeedSocial = await FeedPosts.countDocuments({ BrandEngagementID: brandEngagement._id });
        totalPostsNeedSocial += postsNeedSocial;
      }

      // Count scheduled and live posts
      const currentTime = Date.now();
      const feedPosts = await FeedPosts.find({ BrandEngagementID: brandEngagement._id });
      for (const post of feedPosts) {
        if (post.unixTimestamp > currentTime) {
          totalPostsScheduled++;
        } else {
          totalPostsLive++;
        }
      }
    }

    return res.json({ totalStatus, totalPostsScheduled, totalPostsLive, totalPostsNeedSocial });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export {getTotalClientConnectStatus,saveClientConnect,getClientConnects,getConnectURLByBEID,checkConnectLinkExistsByBrandEngagementID };
