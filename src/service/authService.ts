import bcrypt from "bcrypt"
import { UserModel } from "../model/user";

interface ISignUp {
  username: string;
  email: string;
  password: string;
}

export async function signUp(data: ISignUp) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    
    const user = await UserModel.create({
      username: data.username,
      email: data.email,
      passwordHash: hash,
    });

    return {
      user: { userId: user._id, username: user.username, email: user.email },
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      err_message: `Error creating user account: ${error}`,
      success: false,
    };
  }
}

interface ILogin {
  email: string;
  password: string;
}

export async function login(data: ILogin) {
  try {
    const user = await UserModel.findOne({ email: data.email }).lean();
    if (!user) {
      return {
        err_message: "no user found with email or password",
        success: false,
      };
    }
    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return {
        err_message: "incorrect password",
        success: false
      }
    }
    return {
      user: { userId: user._id, username: user.username, email: user.email },
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      err_message: `Error logging in: ${error}`,
      success: false,
    };
  }
}
