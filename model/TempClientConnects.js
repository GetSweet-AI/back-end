import mongoose from "mongoose";

const TempClientConnectsSchema = new mongoose.Schema({
    Link: {
        type: String,
        default: null,
     },
   
});



export default mongoose.model("TempClientConnects", TempClientConnectsSchema);

