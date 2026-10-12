import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProductDisplayImage } from "../utils/curatedImages";

function Wishlist() {
  const { wishlist, loading, error, fetchWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    if (!customer) {
      navigate("/login");
      return;
    }
    await addToCart(product._id);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              My Wishlist ❤️
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {wishlist.length === 1
                ? "1 product saved for later"
                : `${wishlist.length} products saved for later`}
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

        {/* State 1: Loading */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent mb-3" />
            <p className="text-gray-600 font-medium">Loading your wishlist...</p>
          </div>
        )}

        {/* State 2: Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto my-12">
            <span className="text-4xl mb-3 block">💔</span>
            <h2 className="text-lg font-bold text-red-900 mb-1">
              Something went wrong.
            </h2>
            <p className="text-sm text-red-600 mb-6">
              We couldn't load your wishlist.
            </p>
            <button
              onClick={fetchWishlist}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ❤️
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Save products you love and find them here later.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition shadow"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* State 4: Saved Products Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const displayImg = getProductDisplayImage(item);
              const isOutOfStock = item.stock <= 0;

              return (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                    <Link to={`/products/${item._id}`}>
                      <img
                        src={displayImg}
                        alt={item.name}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = getProductDisplayImage(item, 1);
                        }}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>

                    <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-0.5 rounded shadow-sm border border-gray-200">
                      {item.category}
                    </span>

                    {/* Quick remove button on top right */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      title="Remove from Wishlist"
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-red-500 shadow-sm hover:bg-white hover:scale-110 transition border border-gray-200"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/products/${item._id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.category}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isOutOfStock ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isOutOfStock ? "Out of stock" : `${item.stock} in stock`}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/products/${item._id}`}
                          className="px-3 py-2 text-xs font-semibold text-center text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={isOutOfStock}
                          className="px-3 py-2 text-xs font-semibold text-center text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
                        >
                          {isOutOfStock ? "Sold Out" : "Add to Cart"}
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="w-full text-center text-xs text-red-600 hover:text-red-800 py-1 transition font-medium"
                      >
                        Remove from Wishlist
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;
