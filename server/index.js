
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";

import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

const Port = Number(process.env.PORT) || 8080;

const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    ...(process.env.CLIENT_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
]);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.has(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Origin not allowed by CORS"));
        },
        methods: [
            "POST",
            "GET",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);

// Uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/auth", customerRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Server says Hello");
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        if (!process.env.dbUrl) {
            throw new Error("dbUrl is missing from the .env file");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.dbUrl);

        console.log("DB connected");

        app.listen(Port, () => {
            console.log(`Server started at http://localhost:${Port}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        if (error.message.includes("whitelist") || error.message.includes("Could not connect")) {
            console.error("\n👉 Action required in MongoDB Atlas:");
            console.error("   Log in to MongoDB Atlas -> Network Access -> Add IP Address -> Select 'Allow Access From Anywhere' (0.0.0.0/0) or add your current IP address.\n");
        }
        process.exit(1);
    }
};

startServer();
