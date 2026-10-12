import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../Services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  // Fetch products from backend
  const fetchProductList = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category && category !== "All" && category !== "All Categories") {
        params.category = category;
      }
      if (sort) params.sort = sort;

      const data = await getProducts(params);
      if (data && data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProductList();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchProductList]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("search", val);
    else newParams.delete("search");
    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== "All" && val !== "All Categories") {
      newParams.set("category", val);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("sort", val);
    else newParams.delete("sort");
    setSearchParams(newParams, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Accessories",
    "Beauty"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Explore Products
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse our catalog, search by name, or filter by category.
            </p>
          </div>

          <Link
            to="/products/create"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition w-fit"
          >
            <span>+ Add Product</span>
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              aria-label="Search products"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
              🔍
            </span>
            {search && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("search");
                  setSearchParams(newParams, { replace: true });
                }}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={category || "All Categories"}
                onChange={handleCategoryChange}
                className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === "All Categories" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto">
              <select
                value={sort}
                onChange={handleSortChange}
                className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort By</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Button */}
            {(search || category || sort) && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* State 1: Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-3" />
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        )}

        {/* State 2: Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-lg mx-auto my-8">
            <span className="text-3xl mb-2 block">⚠️</span>
            <p className="text-red-700 font-semibold mb-3">{error}</p>
            <button
              onClick={fetchProductList}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center max-w-md mx-auto my-8">
            <span className="text-4xl mb-3 block">📦</span>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't find any products matching your search criteria. Try modifying your search or clearing filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* State 4: Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div>
            <div className="mb-4 text-xs font-medium text-gray-500">
              Showing {products.length} {products.length === 1 ? "product" : "products"}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Products;
