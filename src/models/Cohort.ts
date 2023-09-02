import mongoose, { Schema, Document, Types } from 'mongoose';
import { IWeek, WeekSchema } from './Week';

export interface ICohort extends Document {
  name: string;
  start: Date;
  end: Date;
  type: CohortSubject;
  participants: Array<Types.ObjectId>;
  weeks: Array<IWeek>;
  slackId?: string;
}

export type CohortSubject =
  | 'Intro to programming'
  | 'React.js'
  | 'Node.js/Express'
  | 'Ruby on Rails';

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
      validate: {
        validator: function (this: ICohort, value: Date): boolean {
          return this.start < value;
        },
        message: 'End time must be after start time',
      },
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
    weeks: [WeekSchema],
    slackId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cohort', CohortSchema);
