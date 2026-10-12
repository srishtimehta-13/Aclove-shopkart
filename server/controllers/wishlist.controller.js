import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
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

        const customer = await Customer.findById(req.customer._id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        customer.wishlist = customer.wishlist || [];
        const isAlreadyInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        );

        if (isAlreadyInWishlist) {
            return res.status(409).json({
                success: false,
                message: "Already in wishlist"
            });
        }

        customer.wishlist.push(productId);
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });
    } catch (error) {
        console.error("ADD TO WISHLIST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add to wishlist",
            error: error.message
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customer = await Customer.findById(req.customer._id).populate({
            path: "wishlist",
            select: "name description price category image images stock createdAt"
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const wishlist = (customer.wishlist || [])
            .filter((item) => item !== null)
            .map((item) => {
                const obj = item.toObject ? item.toObject() : item;
                if (!obj.image && obj.images && obj.images.length > 0) {
                    obj.image = obj.images[0];
                }
                return obj;
            });

        return res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist
        });
    } catch (error) {
        console.error("GET WISHLIST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch wishlist",
            error: error.message
        });
    }
};

export const removeFromWishlist = async (req, res) => {
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

        customer.wishlist = customer.wishlist || [];
        const index = customer.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist"
            });
        }

        customer.wishlist.splice(index, 1);
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (error) {
        console.error("REMOVE FROM WISHLIST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist",
            error: error.message
        });
    }
};

export const toggleWishlist = async (req, res) => {
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

        const customer = await Customer.findById(req.customer._id);
        customer.wishlist = customer.wishlist || [];

        const exists = customer.wishlist.some(
            (id) => id.toString() === productId
        );

        if (exists) {
            customer.wishlist = customer.wishlist.filter(
                (id) => id.toString() !== productId
            );
            await customer.save();
            return res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
                inWishlist: false
            });
        } else {
            customer.wishlist.push(productId);
            await customer.save();
            return res.status(200).json({
                success: true,
                message: "Product added to wishlist",
                inWishlist: true
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to toggle wishlist",
            error: error.message
        });
    }
};
