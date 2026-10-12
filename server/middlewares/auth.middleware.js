import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        token = req.headers.authorization;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.jwt_secret);
    const userId = decoded.customerId || decoded.id || decoded.userId;

    const customer = await Customer.findById(userId);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found"
      });
    }

    req.customer = customer;
    req.user = customer;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};
