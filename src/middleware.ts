import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export async function ensureIsAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get token from authorization header
  const headerToken = (req.headers.authorization ||
    req.headers.Authorization) as string;
  // console.log(headerToken)
  if (!headerToken || !headerToken.includes("Bearer ")) {
    return next(new Error("no bearer token is provided"));
  }
  const token = headerToken.split("Bearer ")[1];
  try {
    const validToken = jwt.verify(
      token,
      `${process.env.ACCESS_TOKEN_SECRET}`
    ) as {
      username: string;
      email: string;
      userId: string;
    };
    req.user = validToken;
    console.log("======= user token ==========\n", validToken);
  } catch (error) {
    return next(new Error("Invalid token"));
  }

  // if it's not a valid token, the function would throw an error that would be handled globally
  // otherwise, it means the token is valid
  return next();
}
