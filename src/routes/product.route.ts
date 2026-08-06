import express from "express";
const router = express.Router();
import * as productController from "../controllers/product.controller.js";
import { validateCreateProduct, validateGetProducts } from "../validators/product.validator.js";
import { verifyToken, authorize } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });
// Admin api routes
router.post("/", verifyToken, authorize("admin"), upload.array("images", 5), validateCreateProduct, productController.createProduct);
router.patch("/:id", verifyToken, authorize("admin"), upload.array("images", 5), productController.updateProduct);
router.delete("/:id", verifyToken, authorize("admin"), productController.deleteProduct);

// Customer api routes
router.get("/", validateGetProducts, productController.getProducts);
router.get("/:slug", productController.getProductBySlug);

export default router;