import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWeek extends Document {
  name: string;
  start: Date;
  end: Date;
  sessions: Array<Types.ObjectId>;
}

export const WeekSchema = new mongoose.Schema<IWeek>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide start time'],
    },
    end: {
      type: Date,
    },
    sessions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Session',
      },
    ],
  },
  { timestamps: true }
);

const calculateEnd = (start: any) => {
  const startDate = new Date(start);
  const endDate = new Date(
    startDate.getTime() + 7 * 24 * 60 * 60 * 1000 - 1000
  );
  return endDate;
};

WeekSchema.pre('save', function (next) {
  if (this.start && !this.end) {
    this.end = calculateEnd(this.start);
  }
  next();
});

const Week = mongoose.model<IWeek>('Week', WeekSchema);

export { Week, calculateEnd };
