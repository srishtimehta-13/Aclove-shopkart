import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";
import { getProductDisplayImage } from "../utils/curatedImages";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [isWishlisting, setIsWishlisting] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  // Safe image resolution
  const displayImage = getProductDisplayImage(product, imageError ? 1 : 0);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!customer) {
      navigate("/login");
      return;
    }
    if (isWishlisting) return; // Prevent duplicate clicks while saving

    setIsWishlisting(true);
    setFeedbackMsg("");
    try {
      const res = await toggleWishlist(product);
      if (!res.success && res.message) {
        setFeedbackMsg(res.message);
        setTimeout(() => setFeedbackMsg(""), 3000);
      }
    } catch (error) {
      setFeedbackMsg(error.response?.data?.message || "Unable to update wishlist");
      setTimeout(() => setFeedbackMsg(""), 3000);
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!customer) {
      navigate("/login");
      return;
    }
    if (isOutOfStock || isAddingCart) return;

    setIsAddingCart(true);
    setFeedbackMsg("");
    try {
      const res = await addToCart(product._id);
      if (res.success) {
        setFeedbackMsg("Added to cart! 🛍️");
      } else if (res.message) {
        setFeedbackMsg(res.message);
      }
    } catch (error) {
      setFeedbackMsg(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setTimeout(() => {
        setIsAddingCart(false);
        setFeedbackMsg("");
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Category Badge */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm border border-gray-200">
          {product.category || "General"}
        </span>

        {/* Top-right Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlisting}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm hover:bg-white hover:scale-110 transition-all border border-gray-200 disabled:opacity-50"
        >
          {isWishlisting ? (
            <span className="text-xs">⏳</span>
          ) : inWishlist ? (
            <span className="text-red-500 text-base">❤️</span>
          ) : (
            <span className="text-gray-400 text-base">🤍</span>
          )}
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-md shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Info */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2 min-h-[32px]">
            {product.description}
          </p>
        </div>

        {/* Price & Stock status */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          <span
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-red-600"
                : product.stock <= 5
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : `${product.stock} units left`}
          </span>
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="mt-2 text-xs font-medium text-center py-1 px-2 rounded bg-blue-50 text-blue-700">
            {feedbackMsg}
          </div>
        )}

        {/* Buttons Row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            to={`/products/${product._id}`}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
          >
            View Details
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingCart}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingCart ? "Adding..." : isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>

        {/* Quick Wishlist text button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isWishlisting}
          className="mt-2 text-xs text-center text-gray-600 hover:text-red-600 transition-colors flex items-center justify-center gap-1 py-1"
        >
          {isWishlisting ? (
            <span>⏳ Saving...</span>
          ) : inWishlist ? (
            <span className="text-red-600 font-medium">♥ Saved in Wishlist</span>
          ) : (
            <span>♡ Add to Wishlist</span>
          )}
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
