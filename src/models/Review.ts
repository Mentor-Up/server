import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  scheduleId: Schema.Types.ObjectId;
  content: string;
  rating: number;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content can not be blank'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
