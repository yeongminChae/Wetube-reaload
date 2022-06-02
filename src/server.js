import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import cors from "cors";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddleware } from "./middleware";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(flash());
app.use(localMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
const corsOptions = {
  origin: "https://wetube-reloaded-yeongmin.herokuapp.com/",
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "credentialless");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header(
    "Access-Control-Allow-Origin",
    "https://wetube-reloaded-yeongmin.herokuapp.com/"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
export default app;
