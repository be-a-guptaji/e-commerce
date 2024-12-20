import express from "express";
import { sendEMail } from "../controllers/Mail.Controller.js";

const router = express.Router();

router.post("/", sendEMail);

export default router;
