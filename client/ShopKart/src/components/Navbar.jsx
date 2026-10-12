import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";

function Navbar() {
  const { customer, logout } = useAuth();
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" || path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to={customer ? "/home" : "/"} className="flex items-center gap-2">
              <span className="font-serif text-2xl font-medium tracking-[0.12em] text-[#17483F]">ALCOVE</span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to={customer ? "/home" : "/"}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/home")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/products") && !location.pathname.includes("/create")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Products
              </Link>
              {customer && (
                <>
                  <Link
                    to="/orders"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/orders")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/products/create"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive("/products/create")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    + Add Product
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/wishlist")
                  ? "bg-red-50 text-red-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-base text-red-500">❤️</span>
              <span>Wishlist</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart Link */}
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <span className="text-base">🛍️</span>
              <span>Bag</span>
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                {cartCount}
              </span>
            </button>

            {/* Auth Buttons */}
            {customer ? (
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Hi, {customer.fullName?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/wishlist" className="p-2 text-gray-700 relative">
              <span className="text-lg">❤️</span>
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="p-2 text-gray-700 relative"
            >
              <span className="text-lg">🛍️</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle Menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 pt-2 pb-4 space-y-2 bg-white">
          <Link
            to={customer ? "/home" : "/"}
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Wishlist ({wishlistCount})
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Cart ({cartCount})
          </Link>
          {customer && (
            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              My Orders
            </Link>
          )}

          {customer ? (
            <div className="pt-2 border-t border-gray-200">
              <div className="px-3 py-1 text-sm font-semibold text-gray-800">
                Logged in as {customer.fullName}
              </div>
              <Link
                to="/products/create"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100 rounded-md"
              >
                + Add Product
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-200 space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-gray-700 border border-gray-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
