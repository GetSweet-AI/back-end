import mongoose from "mongoose";

const ClientConnectSchema = new mongoose.Schema({
    BrandEngagementID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrandEngagement",
      },
    ConnectLinkURL: {
        type: String,
        default: null,
     },
    FacebookConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     InstagramConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     TwitterConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     LinkedInConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     PinterestConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     YoutubeConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     GoogleBusinessConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
     TikTokConnected: {
        type: String,
        enum: ['yes', 'no', 'error'],
        default: 'no',
     },
  
});



export default mongoose.model("ClientConnect", ClientConnectSchema);


// Database needs a cloud connect table with the following rows
// - EngagmentCardID
// - ConnectLinkURL = NULL by default
// - FacebookConnected = yes/no/error
// - InstagramConnected = yes/no/error
// - TwitterConnected = yes/no/error
// - LinkedInConnected = yes/no/error
// - PinterestConnected = yes/no/error
// - YoutubeConnected = yes/no/error
// - GoogleBusinessConnected = yes/no/error
// - TikTokConnected = yes/no/error