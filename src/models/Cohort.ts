import mongoose, { Schema, Document } from 'mongoose';
import { IWeek } from './Week';
export interface ICohort extends Document {
  name: string;
  start: Date;
  end: Date;
  type:
    | 'Intro to programming'
    | 'React.js'
    | 'Node.js/Express'
    | 'Ruby on Rails';
  participants: Array<string>;
  weeks: Array<IWeek>;
}

const CohortSchema = new mongoose.Schema<ICohort>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      unique: true,
    },
    start: {
      type: Date,
      required: [true, 'Please provide start time'],
    },
    end: {
      type: Date,
      required: [true, 'Please provide end time'],
    },
    type: {
      type: String,
      enum: [
        'Intro to programming',
        'React.js',
        'Node.js/Express',
        'Ruby on Rails',
      ],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    weeks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Week',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Cohort', CohortSchema);
