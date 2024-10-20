import express from "express"
import swaggerUi from "swagger-ui-express";
import { config } from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import storyRouter from "./routes";
import openApiConfig from "./docs/config"
import authRouter from "./routes/authRoutes";
import aiRouter from "./routes/aiRoutes";
// 

// config()


const app = express()

// set up middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}))

app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiConfig, {explorer: true}) )

app.use("/health", (req, res) => {
  res.send("Server is alive!!!")
})

// endpoints
app.use("/api/v1/auth", authRouter)
app.use('/api/v1', storyRouter)



app.use((err: any, req: any, res: any, next: any) => {
    console.log("Global error handler");
    res.status(400).json({message: err.message, success: false});
  });

app.use("*", (req, res) => {
    res.status(501).json({
      message: `${req.method} for ${req.baseUrl} not implemented`,
      sucees: false
    });
});
  

export default app;