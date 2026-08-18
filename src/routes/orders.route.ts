import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import * as orderController from "../controllers/orders.controller.js";
import { validateCreateOrder, validateUpdateOrder } from "../validators/order.validator.js";
const router = express.Router();

router.post("/", verifyToken, authorize("customer"), validateCreateOrder, orderController.createOrder);
router.get("/", verifyToken, authorize("customer"), orderController.getOrders);
router.get("/:id", verifyToken, authorize("customer"), orderController.getOrderById);
router.put("/:id", verifyToken, authorize("customer"), validateUpdateOrder, orderController.updateOrder);
router.delete("/:id", verifyToken, authorize("customer"), orderController.deleteOrder);

export default router;