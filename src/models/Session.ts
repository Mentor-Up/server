import mongoose, { Schema, Document } from 'mongoose';

interface ISession extends Document {
  type: 'Mentor Session' | 'Student Leader Session';
  start: Date;
  end: Date;
  creator: {
    _id: string;
    name: string;
  };
  participant: Array<Schema.Types.ObjectId>;
  discussion: Array<String>;
  review: Array<String>;
  link: string;
  cohortName: string;
}

interface IPopulatedSession extends ISession {
  creator: {
    _id: string;
    name: string;
  };
}

const SessionSchema = new mongoose.Schema<ISession>(
  {
    type: {
      type: String,
      enum: ['Mentor', 'Student Leader'],
    },
    start: {
      type: Date,
      required: [true, 'Please provide start time'],
    },
    end: {
      type: Date,
      // validate: {
      //   validator: function (this: ISession, value: Date): boolean {
      //     return this.start < value;
      //   },
      //   message: 'End time must be after start time',
      // },
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    participant: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    cohortName: {
      type: String,
    },
  },
  { timestamps: true }
);

const SessionModel = mongoose.model('Session', SessionSchema);

export { ISession, SessionModel, IPopulatedSession };
