import { useState, useEffect, useCallback } from "react";
import { getCart, addToCart as apiAddToCart, updateCartQuantity as apiUpdateQty, removeFromCart as apiRemoveFromCart } from "../Services/api";
import { useAuth } from "../hooks/useAuth";
import { CartContext } from "./contexts";

export const CartProvider = ({ children }) => {
  const { customer } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartCustomerId, setCartCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);

  // Fetch cart from backend whenever authenticated customer changes
  const fetchCart = useCallback(async () => {
    if (!customer) {
      return;
    }
    try {
      const response = await getCart();
      if (response && response.cart) {
        setError("");
        setCart(response.cart);
        setCartCustomerId(customer._id);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    void Promise.resolve().then(fetchCart);
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (productOrId) => {
    const productId = typeof productOrId === "object" ? productOrId._id : productOrId;
    if (!customer) {
      setError("Please log in to add items to your cart");
      return { success: false, requireAuth: true, message: "Please log in first" };
    }

    try {
      setError("");
      const res = await apiAddToCart(productId);
      if (res && res.cart) {
        setCart(res.cart);
        setCartCustomerId(customer._id);
      } else {
        await fetchCart();
      }
      setLastAddedItem(typeof productOrId === "object" ? productOrId : null);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add product to cart";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Update quantity of an item in cart
  const updateQuantity = async (productId, newQty) => {
    if (!customer) return { success: false, message: "Please log in first" };
    if (newQty < 1) {
      return removeFromCart(productId);
    }

    try {
      setError("");
      const res = await apiUpdateQty(productId, newQty);
      if (res && res.cart) {
        setCart(res.cart);
        setCartCustomerId(customer._id);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update quantity";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Remove product from cart
  const removeFromCart = async (productId) => {
    if (!customer) return { success: false, message: "Please log in first" };
    try {
      setError("");
      const res = await apiRemoveFromCart(productId);
      if (res && res.cart) {
        setCart(res.cart);
        setCartCustomerId(customer._id);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove item from cart";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Clear cart immediately upon successful verified order
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Derived values:
  // cartCount = sum of item quantities (e.g. Keyboard x 2 + Mouse x 1 = 3)
  const visibleCart = customer && customer._id === cartCustomerId ? cart : [];
  const cartCount = visibleCart.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);

  // subtotal = sum of (price * quantity)
  const cartTotal = visibleCart.reduce((acc, item) => {
    const price = item.product?.price || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart: visibleCart,
        cartItems: visibleCart,
        loading,
        error,
        fetchCart,
        refreshCart: fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        cartCount,
        cartTotal,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
