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
  ShouldDelete : {
    type:Boolean,
    default:false
  },
  IsDeleted : {
    type:Boolean,
    default:false
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  unixTimestamp : {
    type: String,
    required: false,
  },
  cloudTitle: {
    type:String
  },
  toBeArchived:{
    type:Boolean,
    default:false
  },
  archived:{
    type:Boolean,
    default:false
  },
  toBeRevised:{
    type:Boolean,
    default:false
  },
  toBeScheduled: {
    type: Boolean,
    default: false, // Optional with a default value
  },
  scheduled: {
    type: Boolean,
    default: false, // Optional with a default value
  },
  dateCreatedTimestamp: {
    type: String, // or Double, depending on your needs
    required: false, // This makes the field optional
  },
  postType: {
    type: String,
    required: false, // This makes the field optional
  },
  HadFinalCheck:{
    type:Boolean,
    default:false,
    required:false
  }

  
},{ timestamps: true });



export default mongoose.model("FeedPosts", FeedPosts);
