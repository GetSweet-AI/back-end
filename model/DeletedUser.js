import mongoose from "mongoose";

const DeletedUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
      },
      deletedAt: {
        type: Date,
        default: Date.now,
      },
});


export default mongoose.model("DeletedUsers", DeletedUserSchema);
