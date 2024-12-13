import express from "express";
import {
  createCategory,
  fetchCategories,
} from "../controllers/Category.Controller.js";

const router = express.Router();

router.get("/", fetchCategories);
router.post("/", createCategory);

export default router;
