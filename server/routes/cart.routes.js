import express from "express";
import {
    addToCart,
    getCart,
    updateQuantity,
    removeFromCart
} from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const cartRoutes = express.Router();

// All cart routes are protected
cartRoutes.use(isAuthenticated);

cartRoutes.get("/", getCart);
cartRoutes.post("/:productId", addToCart);
cartRoutes.patch("/:productId", updateQuantity);
cartRoutes.delete("/:productId", removeFromCart);

export default cartRoutes;
