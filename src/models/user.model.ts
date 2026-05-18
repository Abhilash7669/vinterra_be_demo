import { IUserModel } from "@/interfaces/users/users.interface.js";
import { model, Schema } from "mongoose";

export const userSchema = new Schema<IUserModel>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = model<IUserModel>("User", userSchema, "users");

export default User;
