import { DUMMY_PASSWORD, DUMMY_TIMEOUT } from "@/constants/dummy.constant.js";
import {
  IDummyUser,
  IUser,
  IUserModel,
} from "@/interfaces/users/users.interface.js";
import { hashPassword } from "@/lib/utils/auth.utils.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import User from "@/models/user.model.js";
import { CreateUserDTO } from "@/types/user.types.js";
import { Types } from "mongoose";

export async function getUserByEmail(email: string): Promise<IDummyUser> {
  const DUMMY_USERS: Array<IDummyUser> = [
    {
      id: "01",
      email: "abhilashsk1998@gmail.com",
      name: "Abhilash",
      password: DUMMY_PASSWORD,
    },
    {
      id: "02",
      email: "aswin@gmail.com",
      name: "Aswin",
      password: DUMMY_PASSWORD,
    },
    {
      id: "04",
      name: "Admin Vinterra",
      email: "admin@vinterra.ai",
      password: "admin123",
    },
  ];

  const userExists = DUMMY_USERS.find((user) => user.email === email);

  if (!userExists) throw new CustomAppError("User does not exists", 404);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(userExists);
    }, DUMMY_TIMEOUT);
  });
}

// User Services
export async function createUserService(_userDetails: CreateUserDTO) {
  const { email, password } = _userDetails;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) throw new CustomAppError("User already exists", 400);

    // hash password
    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      throw new CustomAppError("Error hashing password", 500);
    }

    // save user to DB
    const user = User.create({ email, password: hashedPassword });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    }
    throw new CustomAppError("Something went wrong", 500);
  }
}

export async function getUserByEmailService(
  email: string,
): Promise<IUserModel> {
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) throw new CustomAppError("User not found", 404);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    }
    throw new CustomAppError("Something went wrong", 500);
  }
}

export async function getUserByIdService(userId: string): Promise<IUserModel> {
  try {
    const user = await User.findById(new Types.ObjectId(userId));
    if (!user) throw new CustomAppError("User not found", 404);

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomAppError(error.message, 500);
    }
    throw new CustomAppError("Something went wrong", 500);
  }
}
