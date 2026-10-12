import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

const formatCartItems = (cartItems = []) => {
    return cartItems
        .filter((item) => item.product !== null && item.product !== undefined)
        .map((item) => {
            const itemObj = item.toObject ? item.toObject() : item;
            if (itemObj.product) {
                if (!itemObj.product.image && itemObj.product.images && itemObj.product.images.length > 0) {
                    itemObj.product.image = itemObj.product.images[0];
                }
            }
            return itemObj;
        });
};

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.stock < 1) {
            return res.status(400).json({
                success: false,
                message: "Product is out of stock"
            });
        }

        const customer = await Customer.findById(req.customer._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        customer.cart = customer.cart || [];
        const existingItem = customer.cart.find(
            (item) => item.product && item.product.toString() === productId
        );

        if (existingItem) {
            const newQty = existingItem.quantity + 1;
            if (newQty > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }
            existingItem.quantity = newQty;
        } else {
            if (1 > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Requested quantity exceeds available stock"
                });
            }
            customer.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await customer.save();

        await customer.populate({
            path: "cart.product",
            select: "name description price category image images stock"
        });

        const formattedCart = formatCartItems(customer.cart);

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: formattedCart
        });

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
            error: error.message
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const requestedProductIds = customer.cart
            .map((item) => item.product?.toString())
            .filter(Boolean);

        await customer.populate({
            path: "cart.product",
            select: "name description price category image images stock"
        });

        const availableProductIds = new Set(
            customer.cart
                .filter((item) => item.product)
                .map((item) => item.product._id.toString())
        );
        const unavailableProductIds = requestedProductIds.filter(
            (productId) => !availableProductIds.has(productId)
        );

        if (unavailableProductIds.length > 0) {
            await Customer.updateOne(
                { _id: customer._id },
                { $pull: { cart: { product: { $in: unavailableProductIds } } } }
            );
        }

        const formattedCart = formatCartItems(customer.cart);

        return res.status(200).json({
            success: true,
            cart: formattedCart
        });

    } catch (error) {
        console.error("GET CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (quantity === undefined || quantity === null || isNaN(Number(quantity))) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a number"
            });
        }

        const parsedQty = Number(quantity);

        if (!Number.isInteger(parsedQty) || parsedQty < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive whole number"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (parsedQty > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Quantity exceeds available stock"
            });
        }

        const customer = await Customer.findById(req.customer._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        customer.cart = customer.cart || [];
        const existingItem = customer.cart.find(
            (item) => item.product && item.product.toString() === productId
        );

        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        existingItem.quantity = parsedQty;
        await customer.save();

        await customer.populate({
            path: "cart.product",
            select: "name description price category image images stock"
        });

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: formatCartItems(customer.cart)
        });

    } catch (error) {
        console.error("UPDATE CART QUANTITY ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity",
            error: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.customer._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        customer.cart = customer.cart || [];
        customer.cart = customer.cart.filter(
            (item) => item.product && item.product.toString() !== productId
        );

        await customer.save();

        await customer.populate({
            path: "cart.product",
            select: "name description price category image images stock"
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: formatCartItems(customer.cart)
        });

    } catch (error) {
        console.error("REMOVE FROM CART ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove product from cart",
            error: error.message
        });
    }
};
