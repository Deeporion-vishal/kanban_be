import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import mongoose from "mongoose";
import { pageNotFound } from "./src/middlewares/pageNotFound";
import { errorResponse } from "./src/middlewares/errorResponse";
import UserRoutes from "./src/routes/user.routes";
import boardRouter from './src/routes/board.routes'
import taskRouter from './src/routes/task.routes'
import subTaskRouter from './src/routes/subTask.routes'


const app = express();

dotenv.config();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use('/api',UserRoutes,boardRouter,taskRouter,subTaskRouter)
mongoose
  .connect(process.env.MONGO_CONN_STR as string)
  .then(() => console.log("Connection established with MongoDB!"))
  .catch((err) => console.log(err));

app.all("*", pageNotFound);

app.use(errorResponse);

const PORT = process.env.PORT || 5454; 
app.listen(PORT, () => {
  console.log(`Server listening on port:${PORT}`);
});

export default app;
