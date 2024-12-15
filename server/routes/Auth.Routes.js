import express from "express";
import passport from "passport";
import {
  checkAuth,
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/Auth.Controller.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", passport.authenticate("local"), loginUser);
router.get("/check", passport.authenticate("jwt"), checkAuth);
router.get("/logout", passport.authenticate("jwt"), logoutUser);

export default router;
