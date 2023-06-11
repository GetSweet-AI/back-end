import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

const BrandEngagementSchema = new mongoose.Schema({
  
    Timezone: {
    type: String,
    required: [true, "Please provide Timezone"],
    minlength: 3,
    trim: true,
  },
    WebSite: {
    type: String,
    required: [true, "Please provide WebSite"],
    minlength: 3,
    maxlength: 40,
    trim: true,
  },
    BrandName: {
    type: String,
    required: [true, "Please provide brand name"],
    minlength: 3,
    trim: true,
  },
  CompanySector: {
    type: String,
    required: [true, "Please provide a valid Company Sector"],
    enum:companySectors,
    default:'Other'
  },
  BrandTone: {
    type: String,
    required: [true, "Please provide brand tone"],
    minlength: 3,
    trim: true,
  },
  TargetAudience: {
    type: String,
    required: [true, "Please provide Target Audience"],
    minlength: 3,
    trim: true,
  },
  PostType: {
    type: String,
    enum: ['Quotes', 'general-posts', 'Top-tier-lists','other'],
    default: 'general-posts',
  },
  postContent: {
    type: String,
    required: [true, "Please provide the post content"],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
//   { timestamps: true }
});

BrandEngagementSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, "y/B?E(H+MbPeShVmYq3t6w9z$C&F)J@N", {
    expiresIn: "2h",
  });
};


export default mongoose.model("BrandEngagement", BrandEngagementSchema);
