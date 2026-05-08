import { IDummyUser } from "@/interfaces/users/users.interface.js";
import { getUserByEmail } from "@/service/user.service.js";
import { TResponseDTO } from "@/types/response.types.js";
import { Request, Response } from "express";
import { v4 } from "uuid";

export async function postLoginAuthController(req: Request, res: Response) {
  const { password, email } = req.body;
  const user = await getUserByEmail(email);

  const isUserAuth = user.password === password;
  let response: TResponseDTO<{
    username: IDummyUser["name"];
  } | null>;
  if (!isUserAuth) {
    response = {
      success: false,
      data: null,
      message: "Invalid Password",
    };
  } else {
    response = {
      success: true,
      data: {
        username: user.name,
      },
      message: `Welcome ${user.name}`,
    };
  }
  res.cookie("vinterra-token", v4(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    path: "/",
  });
  return response;
}
