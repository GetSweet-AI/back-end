import { StatusCodes } from "http-status-codes";
import User from "../model/User.js";
import FeedPosts from "../model/FeedPosts.js";
import BrandEngagement from "../model/BrandEngagement.js";
import { badRequestError } from "../errors/index.js";

import dotenv from "dotenv";

import stripeInit from 'stripe';
import DeletedUser from "../model/DeletedUser.js";
import Archive from "../model/Archive.js";
dotenv.config(); 


const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);


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
      .skip(PAGE_SIZE * page);
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

      const PAGE_SIZE = 6;
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
  const getArchiveData = async (req, res, next) => {
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
      // Your logic to retrieve brand engagements based on the user ID
      const archive = await Archive.find({})
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * page);
  
      const total = await Archive.countDocuments({});

      // Return the brand engagements as a response
      res.status(200).json({ total,totalPages: Math.ceil(total / PAGE_SIZE),archive });
    } catch (error) {
      next(error);
    }
  };

  const createUser = async (req, res) => {
    const { fullName, email, password, company,role } = req.body;
    if (!fullName || !email || !password || !company ) {
      throw new badRequestError("Please provide all values");
    }
  
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new badRequestError("Email already in use");
    }
    let customer;
    // Check if the customer exists
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if(customers.data.length>0){
    customer = customers.data[0]
    }else{
      customer = await stripe.customers.create({
        name: fullName,
        email: email,
        description: 'New Customer'
      });
    }
  
    const userAlreadySignedIn = await DeletedUser.findOne({ email });
    let user;
    if(userAlreadySignedIn){
        user = await User.create({ fullName, email, password,company,role,customerId:customer.id,availableTokens:0,isEmailConfirmed:true });
    }else{
      user = await User.create({ fullName, email, password,company,role,customerId:customer.id,isEmailConfirmed:true });
    }
    //try and cash should be implemented (but we use instead expr-async-err)
     
  
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      user,
      token
    });
  };
  
  

export { getUsers,updateUserRole,getFeedPostsForAdmin,getAllBrandManagements,createUser,getArchiveData };
