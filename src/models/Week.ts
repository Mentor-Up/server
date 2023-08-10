import mongoose, { Schema, Document } from 'mongoose';

export interface IWeek extends Document {
  name: string;
  start: Date;
  end: Date;
  sessions: Array<String>;
}

const WeekSchema = new mongoose.Schema<IWeek>(
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

WeekSchema.pre('save', function (next) {
  if (this.start) {
    const endDate = new Date(this.start);
    endDate.setDate(endDate.getDate() + 6);
    this.end = endDate;
  }
  next();
});

export default mongoose.model('Week', WeekSchema);
