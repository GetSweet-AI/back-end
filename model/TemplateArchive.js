import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import companySectors  from "../constants/objects.js";

const TemplateArchiveSchema = new mongoose.Schema({
  
  Title:{
    type:String,
    required:[true,"Please provide the TemplateArchive title"],
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

},{ timestamps: true });



export default mongoose.model("TemplateArchive", TemplateArchiveSchema);
