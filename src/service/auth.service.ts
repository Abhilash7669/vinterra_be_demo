import { DUMMY_TIMEOUT } from "@/constants/dummy.constant.js";
import { IDummyUser } from "@/interfaces/users/users.interface.js";

export async function isUserAuth(
  password: string,
  user: IDummyUser,
): Promise<boolean> {
  return new Promise((resolve) => {
    let isAuth = false;
    if (password === user.password) isAuth = true;

    setTimeout(() => {
      resolve(isAuth);
    }, DUMMY_TIMEOUT);
  });
}

export async function loginAuthService(email: string, password: string) {
  
}
