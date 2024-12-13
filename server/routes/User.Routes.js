import express from "express";
import { fetchUser, updateUser } from "../controllers/User.Controller.js";

const router = express.Router();

router.get("/owner", fetchUser);
router.patch("/:id", updateUser);

export default router;
