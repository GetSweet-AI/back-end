import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

const BrandEngagementSchema = new mongoose.Schema({
  
    Timezone: {
    type: String,
    required: [false, "Please provide Timezone"],
    // minlength: 3,
    trim: true,
    default:""
  },
    WebSite: {
    type: String,
    required: [false, "Please provide WebSite"],
    // minlength: 3,
    // maxlength: 40,
    trim: true,
    default:""
  },
    BrandName: {
    type: String,
    required: [true, "Please provide brand name"],
    // minlength: 3,
    trim: true,
    default:""
  },
  CompanySector: {
    type: String,
    required: [true, "Please provide a valid Company Sector"],
    default:""
    // enum:companySectors,
    // default:'Other'
  },
  BrandTone: {
    type: String,
    required: [true, "Please provide brand tone"],
    minlength: 3,
    trim: true,
    default:""
  },
  // TargetAudience: {
  //   type: String,
  //   required: [false, "Please provide Target Audience"],
  //   minlength: 3,
  //   trim: true,
  //   default:""
  // },
  // PostType: {
  //   type: String,
  //   enum: ['Quotes', 'general-posts', 'Top-tier-lists','other'],
  //   default: 'general-posts',
  // },
  postContent: {
    type: String,
    required: [true, "Please provide the post content"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  feedPostId: {
    type: String,
    default : null
  },
//   { timestamps: true }
});



export default mongoose.model("BrandEngagement", BrandEngagementSchema);
