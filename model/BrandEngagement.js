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
    default:"",
    unique:true
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
  relatedPostsStatus: {
    type: String,
    enum: ["Posts generating...", "Posts are ready"],
    default: "Posts generating..."
  },
  lifeCycleStatus: {
    type: String,
    enum: ["RunForEver", "HasEndDate"],
    default: "RunForEver"
  },
  endDate: {
    type: String, // Storing the date as a string
    // validate: {
    //   validator: function (value) {
    //     // Use a regular expression to check if the format is "YYYY-MM-DD"
    //     return /^(?:\d{4})-(?:\d{2})-(?:\d{2})$/.test(value);
    //   },
    //   message: "Invalid endDate format. Use 'YYYY-MM-DD' format.",
    // },
  },
  startDate: {
    type: String, // Storing the date as a string
  },
  PostType:{
    type: String,
    enum: ["TextImagePost", "TextVideoPost","Both"],
    default: "TextVideoPost"
  },
  attachedPicture: {
    type: [String], // Array of strings (URLs)
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic
        return Array.isArray(value) && value.every(url => typeof url === 'string');
      },
      message: 'attachedPictures must be an array of strings',
    },
  
  }
//   { timestamps: true }
},{ timestamps: true });



export default mongoose.model("BrandEngagement", BrandEngagementSchema);
