import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    scheduleId: Schema.Types.ObjectId;
    content: string;
  }

const ReviewSchema = new mongoose.Schema<IReview>({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
    },
    content: {
        type: String, 
        trim: true,
        required: [true, "Content can not be blank"],
    },
},
{ timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema)