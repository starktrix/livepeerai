import { Router } from "express";
import { loginController, sigupController } from "../controllers/auth-controller";

const authRouter = Router()

authRouter.post("/login", loginController)
authRouter.post("/signup", sigupController)

export default authRouter