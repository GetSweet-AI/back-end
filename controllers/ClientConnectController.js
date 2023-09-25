import { StatusCodes } from "http-status-codes";
import ClientConnect from "../model/ClientConnect.js";
import BrandEngagement from "../model/BrandEngagement.js";

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

export {saveClientConnect,getClientConnects,getConnectURLByBEID,checkConnectLinkExistsByBrandEngagementID };
