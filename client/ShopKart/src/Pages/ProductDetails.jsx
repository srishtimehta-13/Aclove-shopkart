import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../Services/api";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductDisplayImage, getProductImages } from "../utils/curatedImages";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { customer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [fallbackImageError, setFallbackImageError] = useState(false);

  const inWishlist = isInWishlist(id);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProductById(id);
      if (data && data.product) {
        setProduct(data.product);
        setSelectedImageIndex(0);
        setImageError(false);
        setFallbackImageError(false);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.response?.data?.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      void Promise.resolve().then(fetchProduct);
    }
  }, [fetchProduct, id]);

  const handleAddToCart = async () => {
    if (!customer) {
      navigate("/login");
      return;
    }
    if (!product || product.stock <= 0 || isAddingCart) return;

    setIsAddingCart(true);
    setFeedback("");
    try {
      const res = await addToCart(product._id);
      if (res.success) {
        setFeedback("Product added to your cart! 🛍️");
      } else if (res.message) {
        setFeedback(res.message);
      }
    } catch (error) {
      setFeedback(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setTimeout(() => {
        setIsAddingCart(false);
        setFeedback("");
      }, 2000);
    }
  };

  const handleWishlistToggle = async () => {
    if (!customer) {
      navigate("/login");
      return;
    }
    if (isWishlisting) return;

    setIsWishlisting(true);
    setFeedback("");
    try {
      const res = await toggleWishlist(product);
      if (!res.success && res.message) {
        setFeedback(res.message);
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (error) {
      setFeedback(error.response?.data?.message || "Unable to update wishlist");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setIsWishlisting(false);
    }
  };

  const productImages = getProductImages(product);
  const imageCount = Math.max(productImages.length, 1);
  const displayImage = imageError
    ? getProductDisplayImage(product, productImages.length + selectedImageIndex)
    : productImages[selectedImageIndex] || getProductDisplayImage(product);

  const selectImage = (index) => {
    setSelectedImageIndex(index);
    setImageError(false);
    setFallbackImageError(false);
  };

  const showAdjacentImage = (direction) => {
    selectImage((selectedImageIndex + direction + imageCount) % imageCount);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/products" className="hover:text-blue-600 transition-colors">
            ← Back to Products
          </Link>
          {product && (
            <>
              <span>/</span>
              <span className="text-gray-400">{product.category}</span>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate max-w-xs">{product.name}</span>
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4" />
            <p className="text-gray-600 font-medium text-lg">Loading product details...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto my-12">
            <span className="text-4xl mb-3 block">⚠️</span>
            <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Product</h3>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={fetchProduct}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
              <Link
                to="/products"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Product Details Display */}
        {!loading && !error && product && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Product Image Section */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  {fallbackImageError ? (
                    <div className="flex h-full items-center justify-center bg-[#FAF6EE] px-8 text-center font-serif text-xl text-[#17483F]">
                      {product.name}
                    </div>
                  ) : (
                    <img
                      key={`${product._id}-${selectedImageIndex}-${displayImage}`}
                      src={displayImage}
                      alt={`${product.name} — image ${selectedImageIndex + 1} of ${imageCount}`}
                      onError={() => {
                        if (!imageError) {
                          setImageError(true);
                        } else {
                          setFallbackImageError(true);
                        }
                      }}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {imageCount > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => showAdjacentImage(-1)}
                        aria-label="View previous product image"
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-xl text-[#17483F] shadow transition hover:bg-white"
                      >
                        <span aria-hidden="true">‹</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => showAdjacentImage(1)}
                        aria-label="View next product image"
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-xl text-[#17483F] shadow transition hover:bg-white"
                      >
                        <span aria-hidden="true">›</span>
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                        {selectedImageIndex + 1} / {imageCount}
                      </span>
                    </>
                  )}

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold uppercase text-white shadow">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {imageCount > 1 && (
                  <div
                    className="mt-3 flex gap-3 overflow-x-auto pb-2"
                    aria-label="Product images"
                  >
                    {productImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => selectImage(index)}
                        aria-label={`View product image ${index + 1}`}
                        aria-pressed={selectedImageIndex === index}
                        className={`h-20 w-20 flex-none overflow-hidden rounded-lg border-2 transition sm:h-24 sm:w-24 ${
                          selectedImageIndex === index
                            ? "border-[#17483F] ring-2 ring-[#17483F]/20"
                            : "border-gray-200 hover:border-[#71977C]"
                        }`}
                      >
                        <img
                          src={image}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.src = getProductDisplayImage(product, productImages.length + index);
                          }}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="flex flex-col justify-between">
                <div>
                  
                  {/* Category Pill & ID */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      ID: {product._id?.substring(product._id.length - 6)}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-gray-900">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-500">
                      Inclusive of all taxes
                    </span>
                  </div>

                  {/* Stock Status Indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        product.stock > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        product.stock > 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} units available in stock`
                        : "Currently out of stock"}
                    </span>
                  </div>

                  {/* Product Description */}
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>

                </div>

                {/* Feedback Banner */}
                {feedback && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm text-center font-medium">
                    {feedback}
                  </div>
                )}

                {/* Actions: Add to Cart & Wishlist */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || isAddingCart}
                      className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isAddingCart ? (
                        <span>Adding to Cart...</span>
                      ) : product.stock <= 0 ? (
                        <span>Out of Stock</span>
                      ) : (
                        <span>🛍️ Add to Cart</span>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      disabled={isWishlisting}
                      title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      className={`px-5 py-3.5 border rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                        inWishlist
                          ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isWishlisting ? (
                        <span>⏳ Saving...</span>
                      ) : inWishlist ? (
                        <span>❤️ Saved</span>
                      ) : (
                        <span>🤍 Save</span>
                      )}
                    </button>
                  </div>

                  <Link
                    to="/products"
                    className="block text-center text-sm font-medium text-gray-500 hover:text-gray-800 transition py-2"
                  >
                    Continue Shopping
                  </Link>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
