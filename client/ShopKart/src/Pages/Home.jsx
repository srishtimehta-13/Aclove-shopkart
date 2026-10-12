import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { getProducts } from "../Services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function Home() {
  const { customer } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount, wishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPersonalized = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
      setError("");
    } catch (requestError) {
      console.error("Failed to load recommendations:", requestError);
      setError("We couldn't load your recommendations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchPersonalized);
  }, [fetchPersonalized]);

  const firstName = customer?.fullName?.split(" ")[0] || "Collector";

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#292A2A] selection:bg-[#71977C]/20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12 lg:px-20">
        
        {/* Welcome Editorial Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-[#D9D0C3] bg-[#FCFAF6] p-8 md:p-12 shadow-sm">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#71977C]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-[#C89A55]/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9D0C3] bg-white/80 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#71977C]">
              <span className="text-[#C89A55]">✦</span>
              <span>Member Sanctuary</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#17483F] font-normal leading-[1.1]">
              Welcome back, {firstName}.
            </h1>

            <p className="text-sm leading-relaxed text-[#666360] font-light">
              Your personal alcove of curated discoveries. Enjoy tailored recommendations,
              boutique privileges, and early access to artisanal releases.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#17483F] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F7F1E6] transition-all hover:bg-[#164B68]"
              >
                <span>Browse The Collection</span>
                <span className="text-[#C89A55]">✦</span>
              </Link>

              <Link
                to="/products/create"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#17483F] bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#17483F] transition-all hover:bg-[#17483F] hover:text-[#F7F1E6]"
              >
                <span>Curator Ingestion</span>
                <span>+</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Member Activity & Privileges Cards */}
        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          
          {/* Card 1: Curated Bag */}
          <Link
            to="/cart"
            className="rounded-2xl border border-[#D9D0C3] bg-white/80 p-6 transition-all hover:-translate-y-1 hover:border-[#17483F]/30 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71977C]">
                Your Bag
              </span>
              <span className="text-[#C89A55] text-xs">✦</span>
            </div>
            <p className="font-serif text-3xl text-[#17483F] font-medium mt-3">
              {cartCount} {cartCount === 1 ? "Item" : "Items"}
            </p>
            <p className="text-xs text-[#666360] mt-1">
              Your selected pieces are waiting in your shopping bag.
            </p>
            <span className="mt-4 inline-block text-xs font-semibold text-[#17483F]">
              Review Bag →
            </span>
          </Link>

          {/* Card 2: Saved Wishlist */}
          <Link
            to="/wishlist"
            className="rounded-2xl border border-[#D9D0C3] bg-white/80 p-6 transition-all hover:-translate-y-1 hover:border-[#17483F]/30 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#71977C]">
                Saved Pieces
              </span>
              <span className="text-[#C89B91] text-xs">♡</span>
            </div>
            <p className="font-serif text-3xl text-[#17483F] font-medium mt-3">
              {wishlistCount} {wishlistCount === 1 ? "Piece" : "Pieces"}
            </p>
            <p className="text-xs text-[#666360] mt-1">
              Your bookmarked tactile creations and artisan designs.
            </p>
            <span className="mt-4 inline-block text-xs font-semibold text-[#17483F]">
              Explore Saved →
            </span>
          </Link>

          {/* Card 3: Membership Tier */}
          <div className="rounded-2xl border border-[#D9D0C3] bg-white/80 p-6 transition-all hover:-translate-y-1 hover:border-[#17483F]/30 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C89A55]">
                Member Tier
              </span>
              <span className="text-[#C89A55] text-xs">✦</span>
            </div>
            <p className="font-serif text-3xl text-[#17483F] font-medium mt-3">
              Alcove Patron
            </p>
            <p className="text-xs text-[#666360] mt-1">
              Privilege code: <strong className="text-[#17483F]">ALCOVE10</strong> for 10% off.
            </p>
            <span className="mt-4 inline-block text-xs font-semibold text-[#17483F]">
              Privileges Active ✓
            </span>
          </div>

        </section>

        {/* Wishlist Showcase if items saved */}
        {wishlist.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C89B91] font-semibold flex items-center gap-1.5">
                  <span>♡</span> Your Curated Wishlist
                </span>
                <h2 className="font-serif text-3xl text-[#17483F] mt-1">
                  Saved For Consideration
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}

        {/* Personalized Recommendations: ✦ Curated For You */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#71977C] font-semibold flex items-center gap-1.5">
                <span className="text-[#C89A55]">✦</span> Curated For You
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#17483F] mt-1">
                New discoveries for your space
              </h2>
              <p className="text-xs text-[#666360] mt-1">
                Selected according to your taste for quiet luxury and organic textures.
              </p>
            </div>

            <Link
              to="/products"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] hover:text-[#71977C] transition-colors"
            >
              View Full Collection →
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#17483F]/20 border-t-[#17483F]" />
              <p className="font-serif text-base text-[#17483F] mt-3">
                Selecting pieces...
              </p>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-[#D9D0C3] bg-white p-8 text-center">
              <p className="text-sm text-[#666360]">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void fetchPersonalized();
                }}
                className="mt-4 rounded-full bg-[#17483F] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b]"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[#D9D0C3] bg-white p-8 text-center">
              <p className="font-serif text-xl text-[#17483F]">No pieces are available yet</p>
              <p className="mt-2 text-sm text-[#666360]">Check back soon for new discoveries.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Home;