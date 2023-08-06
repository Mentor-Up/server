import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  type: 'Mentor Session' | 'Student Leader Session';
  start: Date;
  end: Date;
  creator: Schema.Types.ObjectId;
  participant: Array<{
    user: {
      userInfo: Schema.Types.ObjectId;
      userStatus: 'confirm' | 'cancel';
    };
  }>;
  discussion: Array<String>;
  review: Array<String>;
  link: string;
}

const SessionSchema = new mongoose.Schema<ISession>(
  {
    type: {
      type: String,
      enum: ['Mentor Session', 'Student Leader Session'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide start time'],
    },
    end: {
      type: Date,
      required: [true, 'Please provide end time'],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    participant: [
      {
        user: {
          userInfo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          userStatus: {
            type: String,
            enum: ['confirm', 'cancel'],
          },
        },
      },
    ],
    discussion: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Session', SessionSchema);
