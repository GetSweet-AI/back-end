import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

const TemplateSchema = new mongoose.Schema({
  
  Title:{
    type:String,
    required:[true,"Please provide the template title"],
    trim:true,
    default:""
  },
  CompanySector: {
    type: String,
    required: [true, "Please provide a valid Company Sector"],
    default:""
  },
  BrandTone: {
    type: String,
    required: [true, "Please provide brand tone"],
    minlength: 3,
    trim: true,
    default:""
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  lifeCycleStatus: {
    type: String,
    enum: ["RunForEver", "HasEndDate"],
    default: "RunForEver"
  },
  endDate: {
    type: String, // Storing the date as a string
    validate: {
      validator: function (value) {
        // Use a regular expression to check if the format is "YYYY-MM-DD"
        return /^(?:\d{4})-(?:\d{2})-(?:\d{2})$/.test(value);
      },
      message: "Invalid endDate format. Use 'YYYY-MM-DD' format.",
    },
  },
  startDate: {
    type: String, // Storing the date as a string
    validate: {
      validator: function (value) {
        // Use a regular expression to check if the format is "YYYY-MM-DD"
        return /^(?:\d{4})-(?:\d{2})-(?:\d{2})$/.test(value);
      },
      message: "Invalid endDate format. Use 'YYYY-MM-DD' format.",
    },
  },
},{ timestamps: true });



export default mongoose.model("Template", TemplateSchema);
