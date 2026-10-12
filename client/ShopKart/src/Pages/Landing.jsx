import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../Services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

function Landing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchFeatured = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data.products || []);
      setError("");
    } catch (requestError) {
      console.error("Failed to load featured products:", requestError);
      setError("We couldn't load the collection. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchFeatured);
  }, [fetchFeatured]);

  const categories = ["All", "Home", "Fashion", "Accessories", "Electronics", "Books", "Beauty"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#292A2A] selection:bg-[#71977C]/20">
      <Navbar />
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 px-6 md:px-12 lg:px-20">
        
        {/* Soft Botanical Blur Accents */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#71977C]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 w-[400px] h-[400px] rounded-full bg-[#C89A55]/10 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          
          {/* Header Typography */}
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9D0C3] bg-[#FCFAF6] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#17483F]">
              <span className="text-[#C89A55]">✦</span>
              <span>An Editorial Concept Boutique</span>
              <span className="text-[#C89A55]">✦</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#17483F] leading-[1.08]">
              Curated for your world
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[#666360] max-w-xl mx-auto font-light">
              A digital sanctuary of objects, slow attire, and tactile treasures.
              Every creation feels discovered rather than mass-produced.
            </p>

            {/* CTAs according to Brand Blueprint */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href="#the-edit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17483F] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#F7F1E6] transition-all hover:bg-[#164B68] hover:shadow-lg"
              >
                <span>Discover The Edit</span>
                <span className="text-[#C89A55]">✦</span>
              </a>

              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-[#17483F] bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17483F] transition-all hover:bg-[#17483F] hover:text-[#F7F1E6]"
              >
                View Collections
              </Link>
            </div>
          </div>

          {/* ================= ARCH HERO VISUAL ================= */}
          <div className="mt-14 sm:mt-20 max-w-4xl mx-auto">
            <div className="relative mx-auto rounded-t-[140px] sm:rounded-t-[220px] rounded-b-3xl overflow-hidden border border-[#D9D0C3] shadow-2xl bg-[#FCFAF6] p-3 sm:p-5">
              
              <div className="relative rounded-t-[125px] sm:rounded-t-[200px] rounded-b-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                <img
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=85"
                  alt="Alcove Curated Sanctuary"
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />

                {/* Floating Botanical Badge */}
                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 rounded-2xl bg-[#F7F1E6]/95 backdrop-blur-md border border-[#D9D0C3] p-4 shadow-lg max-w-xs">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#71977C] font-semibold flex items-center gap-1.5">
                    <span className="text-[#C89A55]">✦</span> Featured Curation
                  </span>
                  <p className="font-serif text-lg text-[#17483F] font-medium mt-0.5">
                    Tactile Organic Stoneware
                  </p>
                  <p className="text-[11px] text-[#666360] mt-0.5">
                    Earth-toned ceramics hand-coiled in limited studio batches.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Three Brand Pillars */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="p-6 rounded-2xl border border-[#D9D0C3]/70 bg-white/60 text-center space-y-2">
              <span className="text-xl text-[#71977C]">🌿</span>
              <h3 className="font-serif text-xl text-[#17483F]">Quiet Luxury</h3>
              <p className="text-xs text-[#666360] leading-relaxed">
                Large whitespace, editorial typography, and soft natural ivory tones that let objects breathe.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#D9D0C3]/70 bg-white/60 text-center space-y-2">
              <span className="text-xl text-[#C89A55]">✦</span>
              <h3 className="font-serif text-xl text-[#17483F]">Intentional Discovery</h3>
              <p className="text-xs text-[#666360] leading-relaxed">
                Every release is an artisanal chapter. Thoughtfully handpicked for enduring warmth and character.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#D9D0C3]/70 bg-white/60 text-center space-y-2">
              <span className="text-xl text-[#164B68]">🫧</span>
              <h3 className="font-serif text-xl text-[#17483F]">Artisanal Integrity</h3>
              <p className="text-xs text-[#666360] leading-relaxed">
                Pure natural materials: Belgian linen, unglazed clay, organic cotton, and hand-milled metals.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Signature Curved Line Divider */}
      <div className="py-6 flex items-center justify-center gap-6 max-w-xl mx-auto px-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D9D0C3]" />
        <span className="text-[#C89A55] text-sm animate-pulse">✦</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D9D0C3]" />
      </div>

      {/* ================= ✦ THE EDIT ================= */}
      <section id="the-edit" className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#71977C] font-semibold mb-2">
                <span className="text-[#C89A55]">✦</span>
                <span>The Edit</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-[#17483F] font-normal tracking-tight">
                New pieces worth discovering
              </h2>
              <p className="text-sm text-[#666360] mt-2 max-w-lg">
                Explore handcrafted selections thoughtfully cataloged for daily ritual and serene living.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all ${
                    selectedCategory === cat
                      ? "bg-[#17483F] text-[#F7F1E6] shadow-sm"
                      : "bg-[#FCFAF6] text-[#5E6060] border border-[#D9D0C3] hover:border-[#17483F]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-[#17483F]/20 border-t-[#17483F]" />
              <p className="font-serif text-lg text-[#17483F] mt-4">
                Curating discoveries...
              </p>
            </div>
          ) : error ? (
            <div role="alert" className="rounded-3xl border border-[#D9D0C3] bg-white p-12 text-center">
              <h3 className="font-serif text-2xl text-[#17483F]">The collection is taking a moment</h3>
              <p className="mt-2 text-sm text-[#666360]">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void fetchFeatured();
                }}
                className="mt-5 rounded-full bg-[#17483F] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b]"
              >
                Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-[#D9D0C3] bg-white p-12 text-center">
              <span className="text-2xl text-[#C89A55]">✦</span>
              <h3 className="font-serif text-2xl text-[#17483F] mt-2">
                No pieces found in this category
              </h3>
              <p className="text-sm text-[#666360] mt-1">
                Try selecting "All" to view the complete boutique edit.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* View Full Collection CTA */}
          <div className="mt-14 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-[#17483F] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#17483F] transition-all hover:bg-[#17483F] hover:text-[#F7F1E6]"
            >
              <span>Explore Complete Archive</span>
              <span className="text-[#C89A55]">✦</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ================= EDITORIAL STORY SECTION ================= */}
      <section className="py-20 md:py-28 bg-[#FAF6EE] border-y border-[#D9D0C3] px-6 md:px-12 lg:px-20 relative">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Arch Photo Showcase */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md">
              
              <div className="rounded-t-[180px] rounded-b-2xl overflow-hidden border border-[#D9D0C3] shadow-xl aspect-[4/5] bg-white">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=85"
                  alt="Ceramic Craftsman"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Offset Decorative Leaf Motif Card */}
              <div className="absolute -bottom-6 -right-6 rounded-2xl bg-[#F7F1E6] p-5 border border-[#D9D0C3] shadow-lg max-w-[220px] hidden sm:block">
                <span className="text-[#71977C] text-lg">🌿</span>
                <p className="font-serif text-sm text-[#17483F] font-medium mt-1">
                  Organic Origin
                </p>
                <p className="text-[10px] text-[#666360] mt-0.5">
                  Natural clay, chemical-free washes, and slow sun curing.
                </p>
              </div>

            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#71977C] font-semibold">
              <span>✦</span>
              <span>Our Philosophy</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#17483F] font-normal leading-tight">
              Where craft meets quiet luxury.
            </h2>

            <p className="text-sm leading-relaxed text-[#666360] font-light">
              In a world hurried by mass production, Alcove stands as a mindful pause.
              We partner with independent master ceramicists, heritage weavers, and
              tactile designers across continents to curate utilitarian treasures.
            </p>

            <p className="text-sm leading-relaxed text-[#666360] font-light">
              Every curve, glaze irregularity, and raw fabric slub is celebrated
              as a mark of living humanity. Not mere items, but quiet anchors for your sanctuary.
            </p>

            <div className="pt-4 flex items-center gap-6">
              <div>
                <span className="font-serif text-3xl text-[#17483F]">100%</span>
                <p className="text-[11px] uppercase tracking-wider text-[#71977C] mt-0.5">
                  Artisanal Sourcing
                </p>
              </div>
              <div className="h-8 w-px bg-[#D9D0C3]" />
              <div>
                <span className="font-serif text-3xl text-[#17483F]">Slow</span>
                <p className="text-[11px] uppercase tracking-wider text-[#71977C] mt-0.5">
                  Batch Production
                </p>
              </div>
              <div className="h-8 w-px bg-[#D9D0C3]" />
              <div>
                <span className="font-serif text-3xl text-[#17483F]">✦</span>
                <p className="text-[11px] uppercase tracking-wider text-[#71977C] mt-0.5">
                  Enduring Design
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#17483F] hover:text-[#71977C] transition-colors"
              >
                <span>Read The Sanctuary Story</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CURATED ROOMS / COLLECTIONS ================= */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C89A55] font-semibold">
              ✦ Curated Realms
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#17483F]">
              Explore by Sanctuary
            </h2>
            <p className="text-sm text-[#666360]">
              Curated collections composed to harmonize your physical surroundings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Realm 1 */}
            <Link
              to="/products?category=Home"
              className="group relative overflow-hidden rounded-3xl border border-[#D9D0C3] bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#FAF6EE]">
                <img
                  src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80"
                  alt="Ceramics & Tableware"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#71977C] font-semibold">
                  01 — Living & Hearth
                </span>
                <h3 className="font-serif text-2xl text-[#17483F] group-hover:text-[#164B68] transition-colors">
                  Ceramics & Objects
                </h3>
                <p className="text-xs text-[#666360]">
                  Earthy vessels, hand-thrown stoneware, and brass ritual trays.
                </p>
              </div>
            </Link>

            {/* Realm 2 */}
            <Link
              to="/products?category=Fashion"
              className="group relative overflow-hidden rounded-3xl border border-[#D9D0C3] bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#FAF6EE]">
                <img
                  src="https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"
                  alt="Organic Attire"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#71977C] font-semibold">
                  02 — Attire & Weaves
                </span>
                <h3 className="font-serif text-2xl text-[#17483F] group-hover:text-[#164B68] transition-colors">
                  Slow Fashion & Linens
                </h3>
                <p className="text-xs text-[#666360]">
                  Washed European linen, raw cotton kimonos, and handwoven shawls.
                </p>
              </div>
            </Link>

            {/* Realm 3 */}
            <Link
              to="/products?category=Accessories"
              className="group relative overflow-hidden rounded-3xl border border-[#D9D0C3] bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#FAF6EE]">
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
                  alt="Adornments & Goods"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#71977C] font-semibold">
                  03 — Adornments
                </span>
                <h3 className="font-serif text-2xl text-[#17483F] group-hover:text-[#164B68] transition-colors">
                  Artisanal Leather & Goods
                </h3>
                <p className="text-xs text-[#666360]">
                  Vegetable-tanned leather carryalls, hammered brass, and subtle accents.
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;