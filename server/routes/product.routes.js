import express from 'express'

import { createProduct, getProducts, getProductById } from '../controllers/product.controller.js'
import upload from "../middlewares/upload.js"
import { isAuthenticated } from "../middlewares/auth.middleware.js"

const productRoutes = express.Router()

const uploadProductImages = (req, res, next) => {
    upload.array("images", 5)(req, res, (error) => {
        if (error) {
            const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
            return res.status(status).json({
                success: false,
                message: error.message || "Invalid product image upload"
            });
        }
        next();
    });
};

productRoutes.post('/', isAuthenticated, uploadProductImages, createProduct)

productRoutes.get('/', getProducts)

productRoutes.get('/:id', getProductById)

export default productRoutes