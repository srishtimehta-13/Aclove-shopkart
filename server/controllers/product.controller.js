import Product from "../models/product.model.js";
import cloudinary, { isCloudinaryConfigured } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const validNumberInput = (value) =>
            (typeof value === "number" || typeof value === "string") &&
            String(value).trim() !== "";

        if (
            typeof name !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            !name.trim() ||
            !description.trim() ||
            !category.trim() ||
            !validNumberInput(price) ||
            !validNumberInput(stock)
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                message: "Price must be a valid number greater than 0"
            });
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return res.status(400).json({
                message: "Stock must be a non-negative whole number"
            });
        }

        const imageUrls = [];

        // 1. Process uploaded files
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                let uploadedUrl = null;

                if (isCloudinaryConfigured) {
                    try {
                        const result = await new Promise((resolve, reject) => {
                            cloudinary.uploader.upload_stream(
                                {
                                    folder: "alcove-products"
                                },
                                (error, result) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(result);
                                    }
                                }
                            ).end(file.buffer);
                        });

                        if (result && result.secure_url) {
                            uploadedUrl = result.secure_url;
                        }
                    } catch (cloudErr) {
                        console.warn(
                            "Cloudinary upload failed, using local disk storage fallback:",
                            cloudErr.message || cloudErr
                        );
                    }
                }

                // Fallback to local static storage
                if (!uploadedUrl) {
                    const uploadsDir = path.join(process.cwd(), "uploads");
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }

                    const ext = path.extname(file.originalname) || ".jpg";
                    const safeName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                    const filePath = path.join(uploadsDir, safeName);
                    fs.writeFileSync(filePath, file.buffer);

                    const host = req.get("host") || "localhost:8080";
                    const protocol = req.protocol || "http";
                    uploadedUrl = `${protocol}://${host}/uploads/${safeName}`;
                }

                imageUrls.push(uploadedUrl);
            }
        }

        // 2. Process image URLs if sent directly as body params
        if (req.body.imageUrls) {
            const raw = Array.isArray(req.body.imageUrls)
                ? req.body.imageUrls
                : [req.body.imageUrls];
            for (const u of raw) {
                if (typeof u === "string" && u.trim().length > 0) {
                    imageUrls.push(u.trim());
                }
            }
        }
        if (req.body.image && typeof req.body.image === "string" && req.body.image.trim().length > 0) {
            imageUrls.push(req.body.image.trim());
        }

        if (imageUrls.length === 0) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const primaryImage = imageUrls[0];

        const newProduct = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: parsedPrice,
            category: category.trim(),
            image: primaryImage,
            images: imageUrls,
            stock: parsedStock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct,
            _id: newProduct._id,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            category: newProduct.category,
            image: newProduct.image,
            stock: newProduct.stock
        });

    } catch (error) {
        console.log("CREATE PRODUCT ERROR:", error);

        return res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;

        const query = {};
        const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        if (typeof search === "string" && search.trim()) {
            query.name = {
                $regex: escapeRegex(search.trim()),
                $options: "i"
            };
        }

        if (typeof category === "string" && category.trim() && category !== "All" && category !== "All Categories") {
            query.category = {
                $regex: `^${escapeRegex(category.trim())}$`,
                $options: "i"
            };
        }

        let productsQuery = Product.find(query);

        if (sort === "price_asc") {
            productsQuery = productsQuery.sort({ price: 1 });
        } else if (sort === "price_desc") {
            productsQuery = productsQuery.sort({ price: -1 });
        }

        const products = await productsQuery;

        const formattedProducts = products.map((p) => {
            const obj = p.toObject ? p.toObject() : p;
            if (!obj.image && obj.images && obj.images.length > 0) {
                obj.image = obj.images[0];
            }
            return obj;
        });

        return res.status(200).json({
            success: true,
            count: formattedProducts.length,
            products: formattedProducts
        });

    } catch (error) {
        console.log("GET PRODUCTS ERROR:", error);

        return res.status(500).json({
            message: "Server crashed",
            error: error.message
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const obj = product.toObject ? product.toObject() : product;
        if (!obj.image && obj.images && obj.images.length > 0) {
            obj.image = obj.images[0];
        }

        return res.status(200).json({
            success: true,
            product: obj
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
};