import express from "express";
import { signUp, login, updateProfile } from "../Controller/userController.js";
import { protectRoute } from "../middleware/auth.js";
import { checkAuth } from "../Controller/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);

export default userRouter;