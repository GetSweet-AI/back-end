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
    maxlength: 20,
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
    required: [true, "Please provide Company Sector"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  TargetAudience: {
    type: String,
    required: [true, "Please provide Target Audience"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  PostType: {
    type: String,
    enum: ['Quotes', 'general-posts', 'Top-tier-lists', 'Top-tier-lists'],
    default: 'general-posts',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
//   { timestamps: true }
});


export default mongoose.model("BrandEngagement", BrandEngagementSchema);
