import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { getProductDisplayImage } from "../utils/curatedImages";

function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "ALCOVE10") {
      setDiscountPercent(10);
      setPromoMessage("✦ 10% Curator Privilege applied");
    } else if (promoCode.trim().toUpperCase() === "FIRSTBOUTIQUE") {
      setDiscountPercent(15);
      setPromoMessage("✦ 15% Welcome Privilege applied");
    } else {
      setDiscountPercent(0);
      setPromoMessage("Invalid privilege code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close shopping bag"
        onClick={closeCart}
        className="fixed inset-0 bg-[#292A2A]/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 flex w-full max-w-full justify-end">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="flex w-full max-w-md flex-col border-l border-[#D9D0C3] bg-[#F7F1E6] shadow-2xl"
        >
          
          {/* Header */}
          <div className="border-b border-[#D9D0C3] px-6 py-5 flex items-center justify-between bg-[#FAF6EE]">
            <div className="flex items-center gap-2">
              <span className="text-[#C89A55] text-sm">✦</span>
              <h2 id="cart-drawer-title" className="font-serif text-2xl font-normal text-[#17483F]">
                Your Curated Bag
              </h2>
              <span className="text-xs font-mono font-medium rounded-full bg-[#EBF2EC] px-2.5 py-0.5 text-[#17483F]">
                {cartCount}
              </span>
            </div>

            <button
              onClick={closeCart}
              className="text-[#5E6060] hover:text-[#17483F] p-1.5 transition-colors text-lg"
              aria-label="Close bag"
            >
              ✕
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          {cart.length > 0 && (
            <div className="bg-[#FAF6EE] px-6 py-3 border-b border-[#E8DFC8]/60 text-xs">
              <div className="flex justify-between items-center text-[#5E6060] mb-1.5">
                {isFreeShipping ? (
                  <span className="text-[#17483F] font-medium flex items-center gap-1.5">
                    <span className="text-[#71977C]">✓</span> Complimentary boutique delivery unlocked
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#17483F]">₹{FREE_SHIPPING_THRESHOLD - cartTotal}</strong> more for complimentary delivery
                  </span>
                )}
                <span className="text-[#C89A55] font-serif text-sm">✦</span>
              </div>
              <div className="w-full bg-[#E5DCCB] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#17483F] h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-[#D9D0C3] flex items-center justify-center text-[#C89A55] text-2xl mb-4 bg-white/60">
                  ✦
                </div>
                <h3 className="font-serif text-2xl text-[#17483F]">
                  Your bag is empty
                </h3>
                <p className="text-sm text-[#666360] mt-2 max-w-xs leading-relaxed">
                  Discover carefully curated objects, apparel, and tactile treasures.
                </p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#17483F] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#17483F] transition-all hover:bg-[#17483F] hover:text-[#F7F1E6]"
                >
                  Explore Collection →
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const imgUrl = getProductDisplayImage(item.product);
                return (
                  <div
                    key={item.product._id}
                    className="flex gap-4 p-3 rounded-2xl border border-[#E5DCCB] bg-white/70 transition-all hover:bg-white"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#FAF6EE] flex-shrink-0 border border-[#E5DCCB]/60">
                      <img
                        src={imgUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = getProductDisplayImage(item.product, 1);
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-[#71977C] font-semibold">
                            {item.product.category}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-xs text-[#8E8A85] hover:text-red-700 transition-colors"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                        <h4 className="font-serif text-base text-[#17483F] line-clamp-1 font-medium mt-0.5">
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-semibold text-[#17483F] mt-1">
                          ₹{item.product.price?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E5DCCB]/50">
                        <div className="flex items-center border border-[#D9D0C3] rounded-lg bg-[#FAF6EE]">
                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity - 1)
                            }
                            className="px-2.5 py-0.5 text-xs text-[#17483F] hover:bg-[#E5DCCB] transition-colors"
                          >
                            –
                          </button>
                          <span className="px-2 text-xs font-medium text-[#17483F]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product._id, item.quantity + 1)
                            }
                            className="px-2.5 py-0.5 text-xs text-[#17483F] hover:bg-[#E5DCCB] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-medium text-[#666360]">
                          ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="border-t border-[#D9D0C3] bg-[#FAF6EE] p-6 space-y-4">
              
              {/* Promo code */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Privilege code (try ALCOVE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 rounded-xl border border-[#D9D0C3] bg-[#FCFAF6] px-3 py-2 text-xs text-[#17483F] placeholder-[#8E8A85] outline-none focus:border-[#17483F]"
                />
                <button
                  type="submit"
                  className="rounded-xl border border-[#17483F] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#17483F] hover:bg-[#17483F] hover:text-white transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    discountPercent > 0 ? "text-[#71977C]" : "text-red-600"
                  }`}
                >
                  {promoMessage}
                </p>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs text-[#666360]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#17483F] font-medium">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#71977C]">
                    <span>Curator Privilege ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Boutique Delivery</span>
                  <span>{shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}</span>
                </div>
                <div className="pt-2 border-t border-[#D9D0C3] flex justify-between items-baseline text-sm font-semibold text-[#17483F]">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="text-lg">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="pt-1 text-[10px] text-[#8E8A85]">
                  Taxes and complimentary boutique delivery calculated.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full rounded-xl bg-[#17483F] py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#F7F1E6] transition-all hover:bg-[#0f322b] hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span className="text-[#C89A55]">✦</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full rounded-xl border border-[#D9D0C3] bg-white/80 py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#17483F] transition-all hover:bg-white flex items-center justify-center gap-1.5"
                >
                  <span>Review bag details</span>
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs font-medium text-[#666360] hover:text-[#17483F] py-1 transition-colors"
                >
                  Continue Discovering
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;
