import { axiosInstance } from "../axiosCalls/axios";

export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get("/products", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await axiosInstance.post("/products", formData);
  return response.data;
};

export const loginCustomer = async (credentials) => {
  const response = await axiosInstance.post("/customers/login", credentials);
  return response.data;
};

export const registerCustomer = async (data) => {
  const response = await axiosInstance.post("/customers/register", data);
  return response.data;
};

export const getCurrentCustomer = async () => {
  const response = await axiosInstance.get("/customers/me");
  return response.data;
};

export const logoutCustomer = async () => {
  const response = await axiosInstance.post("/customers/logout");
  return response.data;
};

// Wishlist APIs
export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await axiosInstance.post(`/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await axiosInstance.delete(`/wishlist/${productId}`);
  return response.data;
};

export const toggleWishlist = async (productId) => {
  const response = await axiosInstance.patch(`/wishlist/${productId}/toggle`);
  return response.data;
};

// Cart APIs
export const getCart = async () => {
  const response = await axiosInstance.get("/cart");
  return response.data;
};

export const addToCart = async (productId) => {
  const response = await axiosInstance.post(`/cart/${productId}`);
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await axiosInstance.patch(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await axiosInstance.delete(`/cart/${productId}`);
  return response.data;
};

// Order APIs (Lab 06)
export const createPaymentOrder = async (shippingAddress) => {
  const response = await axiosInstance.post("/orders/create-payment-order", {
    shippingAddress
  });
  return response.data;
};

export const verifyPayment = async (verificationData) => {
  const response = await axiosInstance.post("/orders/verify-payment", verificationData);
  return response.data;
};

export const getOrders = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axiosInstance.get(`/orders/${id}`);
  return response.data;
};
