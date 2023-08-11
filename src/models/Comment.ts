import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  sessionId: Schema.Types.ObjectId;
  name: Schema.Types.ObjectId;
  content: string;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
      required: [true, 'Content can not be blank'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', CommentSchema);
