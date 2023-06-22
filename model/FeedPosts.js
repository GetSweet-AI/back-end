import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

const FeedPosts = new mongoose.Schema({
  
    Date: {
    type: String,
    required: [true, "Please provide Date"],
  },
    MediaUrl: {
    type: String,
    required: [true, "Please provide MediaUrl"],
    trim: true,
  },
    Caption: {
    type: String,
    required: [true, "Please provide caption"],
  },
  Accounts: {
    type: String,
    required: [true, "Please provide accounts"],
  },
  BrandEngagementID: {
    type: String,
    required: [true, "Please provide BrandEngagementID"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
//   { timestamps: true }
});



export default mongoose.model("FeedPosts", FeedPosts);
