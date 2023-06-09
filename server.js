import express from "express";
const app = express();

import morgan from "morgan";
import cors from "cors";
app.use(cors());

import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";

//db and authUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import gptRouter from "./routes/gptRoutes.js";
import brandEngagementRoutes from "./routes/brandEngagementRoutes.js";

//middleware
import errorHandlerMiddleware from "./middleware/error-handler.js";
import notFoundModule from "./middleware/not-found.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "Welcome!" });
});

app.get("/api/v1", (req, res) => {
  res.status(200).json({ msg: "API" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1",brandEngagementRoutes );
app.use("/api/v1",gptRouter );


app.use(notFoundModule);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

// app.listen(port, () => console.log(`Server is listening on port ${port}...`));

const start = async () => {
  try {
    //The server will run if the connection succeeded
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
