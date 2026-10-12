import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductDisplayImage } from "../utils/curatedImages";

function Cart() {
  const {
    cart,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeFromCart,
    cartCount,
    cartTotal,
  } = useCart();

  const [actionLoading, setActionLoading] = useState({});
  const [actionError, setActionError] = useState("");

  const handleQtyChange = async (productId, currentQty, delta, maxStock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > maxStock) {
      setActionError(`Only ${maxStock} units available in stock`);
      setTimeout(() => setActionError(""), 3000);
      return;
    }

    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    setActionError("");
    try {
      const res = await updateQuantity(productId, newQty);
      if (!res.success && res.message) {
        setActionError(res.message);
        setTimeout(() => setActionError(""), 3000);
      }
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemove = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: true }));
    setActionError("");
    try {
      await removeFromCart(productId);
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              My Cart 🛒
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your curated items and proceed to secure checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            <span>Continue Shopping</span>
            <span>→</span>
          </Link>
        </div>

        {/* Global Action Error Banner */}
        {actionError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium text-center">
            {actionError}
          </div>
        )}

        {/* State 1: Loading */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-gray-600 font-medium">Loading your cart...</p>
          </div>
        )}

        {/* State 2: Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto my-12">
            <span className="text-4xl mb-3 block">⚠️</span>
            <h2 className="text-lg font-bold text-red-900 mb-1">
              Unable to load your cart.
            </h2>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchCart}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty Cart */}
        {!loading && !error && cart.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your cart is empty 🛒
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Looks like you haven't added anything yet. Start browsing products!
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* State 4: Cart Items & Order Summary */}
        {!loading && !error && cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const product = item.product || {};
                const displayImg = getProductDisplayImage(product);
                const isItemLoading = actionLoading[product._id];
                const itemTotal = (product.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={product._id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 transition hover:border-gray-300"
                  >
                    {/* Item Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100"
                    >
                      <img
                        src={displayImg}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getProductDisplayImage(product, 1);
                        }}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <Link to={`/products/${product._id}`}>
                            <h3 className="font-semibold text-gray-900 text-base hover:text-blue-600 transition">
                              {product.name}
                            </h3>
                          </Link>
                          <span className="inline-block mt-0.5 text-xs text-gray-500">
                            Category: {product.category}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900 block">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs text-gray-400">
                            (₹{product.price?.toLocaleString("en-IN")} each)
                          </span>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        
                        {/* [-] quantity [+] */}
                        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                          <button
                            onClick={() =>
                              handleQtyChange(product._id, item.quantity, -1, product.stock)
                            }
                            disabled={item.quantity <= 1 || isItemLoading}
                            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
                            title="Decrease quantity"
                          >
                            −
                          </button>
                          
                          <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[28px] text-center bg-white border-x border-gray-300">
                            {isItemLoading ? "…" : item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQtyChange(product._id, item.quantity, 1, product.stock)
                            }
                            disabled={item.quantity >= product.stock || isItemLoading}
                            className="px-3 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Stock indicator & Remove Button */}
                        <div className="flex items-center gap-4">
                          <span className="hidden sm:inline text-xs text-gray-500">
                            Max: {product.stock} units
                          </span>

                          <button
                            onClick={() => handleRemove(product._id)}
                            disabled={isItemLoading}
                            className="text-xs font-semibold text-red-600 hover:text-red-800 transition py-1 px-2 rounded hover:bg-red-50 disabled:opacity-50"
                          >
                            {isItemLoading ? "Removing..." : "Remove"}
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Total Items:</span>
                  <span className="font-semibold text-gray-900">{cartCount} units</span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Delivery Charges:</span>
                  <span className="font-medium text-gray-500">Calculated at checkout</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-base font-bold text-gray-900">
                  <span>Subtotal:</span>
                  <span className="text-xl text-blue-600 font-extrabold">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#17483F] py-3.5 px-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] transition-all hover:bg-[#0f322b] hover:shadow-lg shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </Link>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-xs text-gray-500 hover:text-gray-800 transition"
                >
                  or Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Cart;
