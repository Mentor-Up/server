import mongoose, { Schema, Document } from "mongoose";

export interface ICohort extends Document {
  name: string;
  start: Date;
  end: Date;
  type: 'ReactJS' | 'NodeJS' | 'Intro';
  participant: Array<string>;
  schedule: Array<string>;
}

const CohortSchema = new mongoose.Schema<ICohort>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      unique: true, 
    },
    start: {
      type: Date,
      required: [true, "Please provide start time"],
    },
    end: {
        type: Date,
        required: [true, "Please provide end time"],
      },
    type: {
        type: String,
        enum: ['ReactJS', 'NodeJS', 'Intro']
      },
    participant: [
        {
        type: Schema.Types.ObjectId,
        ref: "User",
        }
    ], 
    schedule: [
        {
        type: Schema.Types.ObjectId,
        ref: "Schedule",
        }
    ]
  },
  { timestamps: true }
);


export default mongoose.model("Cohort", CohortSchema);
