import { DUMMY_TIMEOUT } from "@/constants/dummy.constant.js";
import { IDummyUser } from "@/interfaces/users/users.interface.js";
import { signJWT, verifyPassword } from "@/lib/utils/auth.utils.js";
import { CustomAppError } from "@/lib/utils/error.utils.js";
import { getUserByEmailService } from "@/service/user.service.js";

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
  // find if user exists
  const user = await getUserByEmailService(email);

  if (user) {
    // compare password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) throw new CustomAppError("Invalid credential", 401);

    console.log("==== GENERATING TOKEN ====");
    const userId = user._id.toString();
    const token = await signJWT(userId);
    console.log("==== GENERATED TOKEN =====");
    console.log(`token: ${token}`);

    return {
      email: user.email,
      token,
    };
  }
}
