import express from "express";
import * as userController from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile", userController.getUserProfile);
userRouter.put("/updateProfile", userController.updateUserProfile);
userRouter.delete("/deleteProfile", userController.deleteUserProfile);


export default userRouter;
