import { useState, useEffect, useCallback } from "react";
import { getWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from "../Services/api";
import { useAuth } from "../hooks/useAuth";
import { WishlistContext } from "./contexts";

export const WishlistProvider = ({ children }) => {
  const { customer } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCustomerId, setWishlistCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = useCallback(async () => {
    if (!customer) {
      return;
    }
    try {
      const res = await getWishlist();
      if (res && res.wishlist) {
        setError("");
        setWishlist(res.wishlist);
        setWishlistCustomerId(customer._id);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError(err.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }, [customer]);

  useEffect(() => {
    void Promise.resolve().then(fetchWishlist);
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    if (!customer) {
      return { success: false, requireAuth: true, message: "Please log in first" };
    }
    try {
      setError("");
      await apiAddToWishlist(productId);
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to wishlist";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!customer) return { success: false, message: "Please log in first" };
    try {
      setError("");
      await apiRemoveFromWishlist(productId);
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove from wishlist";
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const toggleWishlist = async (productOrId) => {
    const productId = typeof productOrId === "object" ? productOrId._id : productOrId;
    if (!customer) {
      return { success: false, requireAuth: true, message: "Please log in first" };
    }

    const alreadyIn = wishlist.some((item) => (item._id || item) === productId);
    if (alreadyIn) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return customer?._id === wishlistCustomerId &&
      wishlist.some((item) => (item._id || item) === productId);
  };

  const visibleWishlist = customer?._id === wishlistCustomerId ? wishlist : [];

  return (
    <WishlistContext.Provider
      value={{
        wishlist: visibleWishlist,
        loading,
        error,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: visibleWishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
