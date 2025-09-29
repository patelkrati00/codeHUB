import express from "express";
import userRouter from "./userRouter.js";
import repoRouter from "./repoRouter.js";

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);


mainRouter.get("/", (req, res) => {
  res.send("welcome");
});

export default mainRouter;
4