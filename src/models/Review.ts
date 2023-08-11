import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  sessionId: Schema.Types.ObjectId;
  content: string;
}

const ReviewSchema = new mongoose.Schema<IReview>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content can not be blank'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Review', ReviewSchema);
