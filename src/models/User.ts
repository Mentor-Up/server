import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  createJWT: () => string;
  createRefreshToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true, // creates a unique index in the db for each email
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre implemented middleware provided by mongoose, reached before saving the model
// This will preprocess the password and hash it before saving
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

// Adds and instance method the our Model
// Since we refer to this here, we cannot use arrow functions
UserSchema.methods.createJWT = function () {
  if (!process?.env.ACCESS_TOKEN_SECRET) {
    throw new Error("The .env file must have an ACCESS_TOKEN_SECRET key.");
  }
  if (!process?.env.ACCESS_TOKEN_EXPIRATION) {
    throw new Error("The .env file must have an ACCESS_TOKEN_EXPIRATION key.");
  }
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    }
  );
};

UserSchema.methods.createRefreshToken = function () {
  if (!process?.env.REFRESH_TOKEN_SECRET) {
    throw new Error("The .env file must have a REFRESH_TOKEN_SECRET key.");
  }
  if (!process?.env.REFRESH_TOKEN_EXPIRATION) {
    throw new Error("The .env file must have a REFRESH_TOKEN_EXPIRATION key.");
  }
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    }
  );
};

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);
