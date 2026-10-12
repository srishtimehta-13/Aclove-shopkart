import express from "express";

import {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById
} from "../controllers/order.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const orderRoutes = express.Router();

// Protect all order routes with authentication middleware
orderRoutes.use(isAuthenticated);

// Order creation endpoints (support both POST /orders and POST /orders/create-payment-order)
orderRoutes.post("/", createPaymentOrder);
orderRoutes.post("/create-payment-order", createPaymentOrder);

// Payment verification
orderRoutes.post("/verify-payment", verifyPayment);

// Order querying
orderRoutes.get("/", getMyOrders);
orderRoutes.get("/:id", getOrderById);

export default orderRoutes;
