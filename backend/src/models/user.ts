import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "inactive";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  paymentProvider?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  subscriptionActivatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "admin"],
      default: "customer",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    subscriptionPlan: {
      type: String,
      default: "trial",
    },
    subscriptionStatus: {
      type: String,
      default: "trial",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    paymentProvider: {
      type: String,
      default: "razorpay",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    subscriptionActivatedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
