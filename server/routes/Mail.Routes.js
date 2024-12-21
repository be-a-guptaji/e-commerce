import express from "express";
import {
  welcomeMail,
  requestResetPassword,
} from "../controllers/Mail.Controller.js";

const router = express.Router();

router.post("/", welcomeMail);
router.post("/reset-password-request", requestResetPassword);

export default router;
