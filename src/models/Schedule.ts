import mongoose, { Schema, Document } from "mongoose";


export interface ISchedule extends Document {
  type: 'Mentor Session' | 'Student Leader Session';
  start: Date;
  end: Date;
  creator: Schema.Types.ObjectId;
  participant: Array<String>;
  discussion: Array<String>;
  review: Array<String>;
  link: string;
  userStatus: 'join' | 'pending' | 'skip'
}

const ScheduleSchema = new mongoose.Schema<ISchedule>(
  {
    type: {
        type: String,
        enum: ['Mentor Session', 'Student Leader Session']
    },
    start: {
        type: Date,
        required: [true, "Please provide start time"],
    },
    end: {
        type: Date,
        required: [true, "Please provide end time"],
      },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    participant: [
        {
        type: Schema.Types.ObjectId,
        ref: "User",
        }
    ], 
    discussion: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        }
    ],
    review: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        }
    ],
    link: {
        type: String,
    }, 
    userStatus: {
        type: String,
        enum: ['join', 'pending', 'skip'],
        default: 'pending',
      }
  },
  { timestamps: true }
);


export default mongoose.model("Schedule", ScheduleSchema);
