import { StatusCodes } from "http-status-codes";
import User from "../model/User.js";
import FeedPosts from "../model/FeedPosts.js";
import BrandEngagement from "../model/BrandEngagement.js";

const getUsers = async (req, res) => {
    try {
      const { userId } = req.query;
  
      // Check if the user with the provided userId exists and has the "admin" role
      const user = await User.findOne({ _id: userId, role: "admin" });
      if (!user) {
        // If the user is not found or is not an admin, return a forbidden error
        return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to perform this action" });
      }
  
      
      const PAGE_SIZE = 8;
      const page = parseInt(req.query.page || "0");
      // Your logic to retrieve brand engagements based on the user ID
      const users = await User.find({isEmailConfirmed:true})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
  
      const total = await User.countDocuments({isEmailConfirmed:true});

      // Fetch all users
      // const users = await User.find({});
      res.status(StatusCodes.OK).json({total,totalPages: Math.ceil(total / PAGE_SIZE),users});


    } catch (error) {
      // If an error occurs during the database query, return an appropriate error message
      if (error.name === "CastError") {
        // If the provided userId is not a valid ObjectId, return a bad request error
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid userId" });
      }
      // Handle other internal server errors
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  const updateUserRole = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check if the user with the provided userId exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
      }
  
    //   console.log('before')
      // Switch the user role
      user.role = user.role === "admin" ? "user" : "admin";
      await User.findByIdAndUpdate(
        userId,
        { $set: { role: user.role } },
        { new: true }
      );
    //   console.log('after')
      res.status(StatusCodes.OK).json({ message: "User role updated successfully", user });
    } catch (error) {
      // Handle error
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };
  

  const getFeedPostsForAdmin = async (req, res) => {
    try {
      const { userId } = req.query;
  
      // Check if the user with the provided userId exists and has the "admin" role
      const user = await User.findOne({ _id: userId, role: "admin" });
      if (!user) {
        // If the user is not found or is not an admin, return a forbidden error
        return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to perform this action" });
      }

      const PAGE_SIZE = 6;
      const page = parseInt(req.query.page || "0");
  
      const total = await FeedPosts.countDocuments({ });
      // Fetch all users
      const feedPosts = await FeedPosts.find({}).limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);;
      res.status(StatusCodes.OK).json({total,totalPages: Math.ceil(total / PAGE_SIZE),feedPosts});
    } catch (error) {
      // If an error occurs during the database query, return an appropriate error message
      if (error.name === "CastError") {
        // If the provided userId is not a valid ObjectId, return a bad request error
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid userId" });
      }
      // Handle other internal server errors
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
  };

  const getAllBrandManagements = async (req, res, next) => {
    try {
      const { userId } = req.query;
  
      // Check if the user with the provided userId exists and has the "admin" role
      const user = await User.findOne({ _id: userId, role: "admin" });

      if (!user) {
        // If the user is not found or is not an admin, return a forbidden error
        return res.status(StatusCodes.FORBIDDEN).json({ error: "You are not authorized to perform this action" });
      }

      const PAGE_SIZE = 4;
      const page = parseInt(req.query.page || "0");
      // Your logic to retrieve brand engagements based on the user ID
      const brandEngagements = await BrandEngagement.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
  
      const total = await BrandEngagement.countDocuments({});

      // Return the brand engagements as a response
      res.status(200).json({ total,totalPages: Math.ceil(total / PAGE_SIZE),brandEngagements });
    } catch (error) {
      next(error);
    }
  };

  
  
  

export { getUsers,updateUserRole,getFeedPostsForAdmin,getAllBrandManagements };
