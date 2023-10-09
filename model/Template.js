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
  // { timestamps: true }
});



export default mongoose.model("Template", TemplateSchema);
