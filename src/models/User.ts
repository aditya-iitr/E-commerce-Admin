import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your IITR email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    otp: String,
    otpExpiry: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevents model overwrite error just like your Product model
const User = models.User || model("User", UserSchema);

export default User;