import express from "express";
import {
  requestResetPassword,
} from "../controllers/Mail.Controller.js";

const router = express.Router();

router.post("/reset-password-request", requestResetPassword);

export default router;
