import express from "express";
const router = express.Router();
import * as categoryController from "../controllers/category.controller.js";
import multer from "multer";
import { verifyToken, authorize } from "../middleware/auth.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
  });

// Admin api routes
router.post("/", verifyToken, authorize("admin"), upload.array("images", 5), categoryController.createCategory);
router.patch("/:id", verifyToken, authorize("admin"), upload.array("images", 5), categoryController.updateCategory);
router.delete("/:id", verifyToken, authorize("admin"), categoryController.deleteCategory);

// Customer api routes
router.get("/", categoryController.getCategories);
router.get("/:slug", categoryController.getCategoryBySlug);

export default router;