import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
 
const UserSchema = new mongoose.Schema({
  picture:String,
  fullName: {
    type: String,
    // required: [true, "Please provide name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a validate email",
    },
    unique: true,
  },
  password: {
    select: false,
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  company: {
    type: String,
    // required: [true, "Please provide company"],
    trim: true,
  },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin","superAdmin"],
      default: "user",
    },
    verificationCode: {
      type: Number,
      required: false,
      default:""
    },
    isEmailConfirmed: {
      type: Boolean,
      required: false,
      default:false
    },
    firstLogin: {
      type: Boolean,
      required: false,
      default:true
    },
    availableTokens: {
      type: Number,
      required: false,
      default:1
    },
    customerId: {
      type: String,
      required: false,
      default:null
    },
    subscriptionId: {
      type: String,
      required: false,
      default:null
    },
    planId: {
      type: String,
      required: false,
      default:null
    },
    subscriptionStatus:{
      type: String,
      required: false,
      default:null
    },
    Plan:{
      type:String,
      enum: ["Free", "Starter Plan", "Growth","Business"],
      default:"Free"
    },
    invoiceUrl : {
      type:String,
      required:false,
      default:null
    },
    signUpMode:{
      type:String,
      enum:["Google","Normal"],
      default:"Normal"
    },
    notificationMessage:{
      type:String,
      required: true,
      enum:["payment_succeeded","payment_failed","none"],
      default:"none"
    },
    lastLoggedIn:{
      type:Date,
      default:null
    },
    countBrandEngagements:{
      type:Number,
      default:0
    },
    trialStartDate: {
      type: Date,
      default: Date.now,
    },
    isTrialActive: {
      type: Boolean,
      default: true,
    }
    
    
},{ timestamps: true });

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", UserSchema);
