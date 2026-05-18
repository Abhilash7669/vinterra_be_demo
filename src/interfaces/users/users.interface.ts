import { Document } from "mongoose";

export interface IDummyUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserModel extends IUser, Document {}
