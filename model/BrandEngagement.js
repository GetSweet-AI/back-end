import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

// Define all days of the week
const daysEnum = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    unique:false
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
  language:{
    type: String,
    enum: ["English", "Spanish","French"],
    default: "English"
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
  
  },
  days: { type: [{ type: String, enum: daysEnum }], default: [] },
  campaignTitle: String // New field for campaign title
},{ timestamps: true });


// Middleware function to generate and assign campaign title before saving
BrandEngagementSchema.pre('save', async function(next) {
  // Only generate a new title if it's a new document
  if (!this.isNew) {
    return next();
  }

  try {
    // Count the number of existing brand engagements with the same BrandName
    const count = await this.constructor.countDocuments({ BrandName: this.BrandName,createdBy: this.createdBy });
    // Set the campaign title to 'Campaign <count>'
    this.campaignTitle = `Campaign ${count + 1}`;
    next();
  } catch (error) {
    next(error);
  }
});


export default mongoose.model("BrandEngagement", BrandEngagementSchema);
