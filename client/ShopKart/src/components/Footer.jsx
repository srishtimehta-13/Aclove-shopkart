import { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [newsletterMessage, setNewsletterMessage] = useState("");

  return (
    <footer className="border-t border-[#D9D0C3] bg-[#FAF6EE] text-[#292A2A] pt-16 pb-12 px-6 md:px-12 lg:px-20 mt-20">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#D9D0C3]/70">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-medium tracking-[0.16em] text-[#17483F]">
                ALCOVE
              </span>
            </Link>
            
            <p className="font-serif text-lg text-[#17483F] italic">
              Curated for your world.
            </p>

            <p className="text-sm text-[#666360] leading-relaxed max-w-sm">
              A digital sanctuary of objects, slow fashion, ceramics, and tactile treasures.
              Every piece in Alcove is chosen for intentional living and quiet luxury.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs uppercase tracking-[0.2em] text-[#71977C]">
              <span>Curated</span>
              <span>•</span>
              <span>Organic</span>
              <span>•</span>
              <span>Timeless</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#17483F]">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-sm text-[#666360]">
              <li>
                <Link to="/products" className="hover:text-[#17483F] transition-colors">
                  The Complete Edit
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="hover:text-[#17483F] transition-colors">
                  Home & Objects
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-[#17483F] transition-colors">
                  Apparel & Linens
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-[#17483F] transition-colors">
                  Adornments
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-[#17483F] transition-colors">
                  Tactile Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Boutique Service */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#17483F]">
              Sanctuary
            </h4>
            <ul className="space-y-2.5 text-sm text-[#666360]">
              <li>
                <Link to="/home" className="hover:text-[#17483F] transition-colors">
                  Member Studio
                </Link>
              </li>
              <li>
                <Link to="/products/create" className="hover:text-[#17483F] transition-colors">
                  Curator Ingestion
                </Link>
              </li>
              <li>
                <span className="text-[#8E8A85]">Complimentary Shipping over ₹2,000</span>
              </li>
              <li>
                <span className="text-[#8E8A85] cursor-default">Artisanal Packaging</span>
              </li>
              <li>
                <span className="text-[#8E8A85] cursor-default">Slow Returns</span>
              </li>
            </ul>
          </div>

          {/* Journal Subscription */}
          <div className="md:col-span-3 space-y-3">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#C89A55]">
              <span>✦</span>
              <span>The Alcove Journal</span>
            </div>
            <p className="text-xs text-[#666360] leading-relaxed">
              Receive our bi-weekly editorial dispatches on new artisanal releases and mindful design.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewsletterMessage("Newsletter sign-up is not available yet.");
              }}
              className="space-y-2"
            >
              <input
                type="email"
                aria-label="Email address for the Alcove Journal"
                placeholder="your.email@alcove.com"
                required
                className="w-full rounded-xl border border-[#D9D0C3] bg-[#FCFAF6] px-3.5 py-2.5 text-xs text-[#17483F] placeholder-[#8E8A85] outline-none transition focus:border-[#17483F]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#17483F] py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] transition-all hover:bg-[#164B68]"
              >
                Join The Circle
              </button>
              {newsletterMessage && (
                <p role="status" className="text-xs text-[#666360]">
                  {newsletterMessage}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Decorative Divider */}
        <div className="py-8 flex items-center justify-center gap-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D9D0C3]" />
          <span className="text-[#C89A55] text-xs">✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D9D0C3]" />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8A85]">
          <p>© {new Date().getFullYear()} ALCOVE BOUTIQUE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy & Terms</span>
            <span>✦</span>
            <span>Artisanal Ethics</span>
            <span>✦</span>
            <span>Worldwide Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
