import express from "express";
import { createBrand, fetchBrands } from "../controllers/Brand.Controller.js";

const router = express.Router();

router.get("/", fetchBrands);
router.post("/", createBrand);

export default router;
