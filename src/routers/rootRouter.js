import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userControllers";
import { search, home } from "../controllers/videoControllers";
import { publickOnlyMiddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/join")
  .all(publickOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rootRouter
  .route("/login")
  .all(publickOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
