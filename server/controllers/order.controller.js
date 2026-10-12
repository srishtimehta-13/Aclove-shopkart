import mongoose from "mongoose";
import crypto from "node:crypto";

import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import razorpay, { isRazorpayConfigured } from "../config/razorpay.js";

const validateShippingAddress = (address) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    return "Shipping address is required.";
  }

  const fields = [
    "fullName",
    "phone",
    "addressLine1",
    "city",
    "state",
    "pincode"
  ];

  for (const field of fields) {
    if (
      typeof address[field] !== "string" ||
      !address[field].trim()
    ) {
      return `${field} is required.`;
    }
  }

  // Accept a 10-digit mobile number, optionally prefixed with +91 or separated by spaces/dashes
  const cleanPhone = address.phone.trim().replace(/[\s-]/g, "");
  if (!/^(?:\+91)?[0-9]{10}$/.test(cleanPhone)) {
    return "Enter a valid 10-digit mobile number.";
  }

  if (!/^\d{6}$/.test(address.pincode.trim())) {
    return "Pincode must contain 6 digits.";
  }

  return null;
};

const cleanShippingAddress = (address) => ({
  fullName: address.fullName.trim(),
  phone: address.phone.trim(),
  addressLine1: address.addressLine1.trim(),
  city: address.city.trim(),
  state: address.state.trim(),
  pincode: address.pincode.trim()
});

// POST /orders/create-payment-order (and POST /orders)
export const createPaymentOrder = async (req, res) => {
  let shopKartOrder;

  try {
    if (!isRazorpayConfigured) {
      return res.status(503).json({
        success: false,
        message: "Online payments are not configured. Please try again later."
      });
    }

    const shippingError = validateShippingAddress(
      req.body?.shippingAddress
    );

    if (shippingError) {
      return res.status(400).json({
        success: false,
        message: shippingError
      });
    }

    const customerId = req.customer?._id || req.user?._id || req.user?.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    const cart = customer.cart || [];

    if (cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty."
      });
    }

    // Reject invalid cart entries before querying products.
    for (const item of cart) {
      if (
        !item.product ||
        !mongoose.Types.ObjectId.isValid(item.product.toString())
      ) {
        return res.status(400).json({
          success: false,
          message: "Your cart contains an invalid product."
        });
      }

      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Your cart contains an invalid quantity."
        });
      }
    }

    // Fetch fresh product data. Never use frontend prices.
    const productIds = cart.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds }
    });

    const productMap = new Map(
      products.map((product) => [
        product._id.toString(),
        product
      ])
    );

    const unavailableProductIds = productIds
      .map((productId) => productId.toString())
      .filter((productId) => !productMap.has(productId));

    if (unavailableProductIds.length > 0) {
      await Customer.updateOne(
        { _id: customer._id },
        { $pull: { cart: { product: { $in: unavailableProductIds } } } }
      );

      return res.status(409).json({
        success: false,
        code: "CART_ITEMS_REMOVED",
        message: "Unavailable items were removed from your cart. Review the updated cart and try again."
      });
    }

    const orderItems = [];
    let totalPaise = 0;

    for (const cartItem of cart) {
      const productId = cartItem.product.toString();
      const product = productMap.get(productId);

      if (
        !Number.isFinite(product.price) ||
        product.price < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.name}.`
        });
      }

      if (
        !Number.isInteger(product.stock) ||
        product.stock < cartItem.quantity
      ) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`
        });
      }

      // Convert each unit price to paise to avoid floating-point
      // arithmetic when calculating the final payment amount.
      const unitPricePaise = Math.round(product.price * 100);
      const lineTotalPaise = unitPricePaise * cartItem.quantity;

      if (
        !Number.isSafeInteger(lineTotalPaise) ||
        !Number.isSafeInteger(totalPaise + lineTotalPaise)
      ) {
        return res.status(400).json({
          success: false,
          message: "Order amount exceeds the supported limit."
        });
      }

      totalPaise += lineTotalPaise;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image || product.images?.[0] || ""
      });
    }

    if (totalPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Order amount must be greater than zero."
      });
    }

    // Save a persistent ShopKart order with PENDING_PAYMENT before opening Checkout.
    shopKartOrder = await Order.create({
      user: customer._id,
      items: orderItems,
      shippingAddress: cleanShippingAddress(
        req.body.shippingAddress
      ),
      totalAmount: totalPaise / 100,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT"
    });

    try {
      // Razorpay expects the amount in paise.
      const razorpayOrder = await razorpay.orders.create({
        amount: totalPaise,
        currency: "INR",
        receipt: shopKartOrder._id.toString()
      });

      shopKartOrder.razorpayOrderId = razorpayOrder.id;
      await shopKartOrder.save();

      return res.status(201).json({
        success: true,
        message: "Payment order created.",
        shopKartOrderId: shopKartOrder._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalPaise,
        currency: "INR",
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (paymentOrderError) {
      // Clean up pending order if Razorpay order creation fails
      await Order.findByIdAndDelete(shopKartOrder._id);
      shopKartOrder = null;
      throw paymentOrderError;
    }
  } catch (error) {
    console.error("CREATE PAYMENT ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create the payment order."
    });
  }
};

// POST /orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    if (!isRazorpayConfigured) {
      return res.status(503).json({
        success: false,
        message: "Online payments are not configured. Please try again later."
      });
    }

    const {
      shopKartOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {};

    if (
      !mongoose.Types.ObjectId.isValid(shopKartOrderId) ||
      typeof razorpay_order_id !== "string" ||
      !razorpay_order_id ||
      typeof razorpay_payment_id !== "string" ||
      !razorpay_payment_id ||
      typeof razorpay_signature !== "string" ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are incomplete."
      });
    }

    const customerId = req.customer?._id || req.user?._id || req.user?.id;

    // Find the order belonging to the authenticated customer.
    const order = await Order.findOne({
      _id: shopKartOrderId,
      user: customerId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    // A completed order cannot be verified again as a new payment.
    if (order.paymentStatus === "PAID") {
      if (order.razorpayPaymentId === razorpay_payment_id) {
        return res.status(200).json({
          success: true,
          message: "Payment was already verified.",
          order
        });
      }

      return res.status(409).json({
        success: false,
        message: "This order has already been paid."
      });
    }

    if (
      order.status !== "PENDING_PAYMENT" ||
      !order.razorpayOrderId ||
      order.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment order does not match."
      });
    }

    // The stored Razorpay Order ID is the trusted value.
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    const validSignature =
      /^[a-f0-9]{64}$/i.test(razorpay_signature) &&
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!validSignature) {
      // Keep the order pending/failed and keep the cart unchanged.
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature."
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found."
      });
    }

    // Update the order only after signature verification.
    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Decrement stock for purchased products
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // Clear the cart only after verified payment.
    customer.cart = [];
    await customer.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and order placed.",
      order
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment."
    });
  }
};

// GET /orders
export const getMyOrders = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.user?._id || req.user?.id;
    const orders = await Order.find({
      user: customerId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders."
    });
  }
};

// GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID."
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    const customerId = (req.customer?._id || req.user?._id || req.user?.id)?.toString();

    // Prevent any user from accessing another user's order
    if (order.user.toString() !== customerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not own this order."
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order."
    });
  }
};
