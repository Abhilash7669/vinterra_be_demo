import { DUMMY_PASSWORD, DUMMY_TIMEOUT } from "@/constants/dummy.constant.js";
import { IDummyUser } from "@/interfaces/users/users.interface.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";

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
