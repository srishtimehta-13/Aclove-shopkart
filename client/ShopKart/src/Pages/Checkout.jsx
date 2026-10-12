import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { createPaymentOrder, verifyPayment } from "../Services/api";
import { getProductDisplayImage } from "../utils/curatedImages";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const { cart, cartTotal, cartCount, clearCart, refreshCart } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: customer?.fullName || "",
    phone: customer?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentFailedMessage, setPaymentFailedMessage] = useState("");

  // Sync auth profile into shipping details if available
  useEffect(() => {
    if (!customer) return;

    void Promise.resolve().then(() => {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || "",
        phone: prev.phone || customer.phone || ""
      }));
    });
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setErrorMessage("");
    setPaymentFailedMessage("");
  };

  // Task 3: Shipping Form Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, "");
    if (!cleanPhone) {
      errors.phone = "Phone number is required.";
    } else if (!/^(?:\+91)?[0-9]{10}$/.test(cleanPhone)) {
      errors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = "Street address is required.";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required.";
    }

    const cleanPincode = formData.pincode.trim();
    if (!cleanPincode) {
      errors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      errors.pincode = "Pincode must contain 6 digits.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setPaymentFailedMessage("");

    // Task 3 Rule: Do not call backend if basic client validation fails.
    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Add items before checking out.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Ensure Razorpay Checkout SDK is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setErrorMessage(
          "Failed to load Razorpay payment gateway. Please check your internet connection."
        );
        setSubmitting(false);
        return;
      }

      // 2. Call backend to validate stock, calculate total, create ShopKart order & Razorpay order
      const shippingAddress = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      };

      const orderData = await createPaymentOrder(shippingAddress);

      if (!orderData || !orderData.razorpayOrderId) {
        throw new Error(orderData?.message || "Failed to initiate payment order.");
      }

      // 3. Open Razorpay Checkout modal in Test Mode
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "ShopKart",
        description: `Order #${orderData.shopKartOrderId?.slice(-6) || "Checkout"}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          // Task 5: Only after backend verifies signature, order becomes PAID and cart clears
          try {
            const verificationPayload = {
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            const verificationResult = await verifyPayment(verificationPayload);

            if (verificationResult.success) {
              // Clear global cart state -> Navbar updates to Cart (0) immediately
              clearCart();

              // Navigate to Order Confirmation screen
              navigate(`/order-success/${orderData.shopKartOrderId}`, {
                state: { order: verificationResult.order }
              });
            } else {
              setErrorMessage(
                verificationResult.message || "Payment verification failed."
              );
              setSubmitting(false);
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            setErrorMessage(
              verifyError.response?.data?.message ||
                "Payment verification failed. Please contact support."
            );
            setSubmitting(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
          email: customer?.email || ""
        },
        theme: {
          color: "#17483F"
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed response:", response.error);
        setPaymentFailedMessage(
          "Payment failed. Your cart has not been cleared. Please try again."
        );
        setSubmitting(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error("Checkout error:", err);
      const serverMsg =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during checkout.";

      if (err.response?.data?.code === "CART_ITEMS_REMOVED") {
        await refreshCart();
      }

      setErrorMessage(serverMsg);
      setSubmitting(false);
    }
  };

  // If cart is empty, show empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-16 text-center w-full">
          <div className="bg-white border border-[#D9D0C3] rounded-3xl p-12 shadow-sm">
            <div className="w-16 h-16 bg-[#EBF2EC] text-[#17483F] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛍️
            </div>
            <h1 className="font-serif text-3xl font-normal text-[#17483F] mb-2">
              Your bag is empty
            </h1>
            <p className="text-sm text-[#666360] mb-6">
              You must have items in your shopping bag before proceeding to checkout.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#17483F] px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#F7F1E6] hover:bg-[#0f322b] transition-all shadow"
            >
              <span>Explore Products</span>
              <span className="text-[#C89A55]">✦</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#71977C] mb-1">
            <Link to="/cart" className="hover:underline">Cart</Link>
            <span>/</span>
            <span className="text-[#17483F]">Checkout</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#17483F] font-normal">
            Checkout & Delivery Details
          </h1>
          <p className="text-sm text-[#666360] mt-1">
            Provide your shipping address and complete test payment via Razorpay.
          </p>
        </div>

        {/* Payment Failure Alert */}
        {paymentFailedMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">{paymentFailedMessage}</p>
              <p className="text-xs text-amber-700 mt-0.5">
                No money was deducted. Your items remain in your cart so you can try again.
              </p>
            </div>
          </div>
        )}

        {/* Server / Validation Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
            <span className="text-xl">✕</span>
            <div>
              <p className="font-semibold">Unable to process order</p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping Address Form (7 cols) */}
          <section className="lg:col-span-7 bg-white border border-[#D9D0C3] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8DFC8]">
              <div className="flex items-center gap-2">
                <span className="text-[#C89A55] text-base">✦</span>
                <h2 className="font-serif text-2xl text-[#17483F] font-normal">
                  Shipping Details
                </h2>
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71977C] bg-[#EBF2EC] px-2.5 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>

            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                    formErrors.fullName
                      ? "border-red-500 bg-red-50/30"
                      : "border-[#D9D0C3] focus:border-[#17483F]"
                  }`}
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                    formErrors.phone
                      ? "border-red-500 bg-red-50/30"
                      : "border-[#D9D0C3] focus:border-[#17483F]"
                  }`}
                />
                {formErrors.phone && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Address Line 1 */}
              <div>
                <label
                  htmlFor="addressLine1"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                >
                  Address (House, Street, Area) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="e.g. 22 MG Road, Indiranagar"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                    formErrors.addressLine1
                      ? "border-red-500 bg-red-50/30"
                      : "border-[#D9D0C3] focus:border-[#17483F]"
                  }`}
                />
                {formErrors.addressLine1 && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.addressLine1}
                  </p>
                )}
              </div>

              {/* City and State (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                      formErrors.city
                        ? "border-red-500 bg-red-50/30"
                        : "border-[#D9D0C3] focus:border-[#17483F]"
                    }`}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                  >
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka"
                    className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                      formErrors.state
                        ? "border-red-500 bg-red-50/30"
                        : "border-[#D9D0C3] focus:border-[#17483F]"
                    }`}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {formErrors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] mb-1.5"
                >
                  Pincode (6 Digits) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 560001"
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#17483F] bg-[#FCFAF6] outline-none transition-colors ${
                    formErrors.pincode
                      ? "border-red-500 bg-red-50/30"
                      : "border-[#D9D0C3] focus:border-[#17483F]"
                  }`}
                />
                {formErrors.pincode && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    {formErrors.pincode}
                  </p>
                )}
              </div>

              {/* Test Mode Notification */}
              <div className="pt-2 text-xs text-[#666360] flex items-center gap-2 border-t border-[#E8DFC8]/60">
                <span className="text-[#C89A55]">🔒</span>
                <span>
                  Razorpay Test Mode Payment. Use test cards/UPI without real money.
                </span>
              </div>

            </form>
          </section>

          {/* Right Column: Order Summary (5 cols) */}
          <section className="lg:col-span-5 bg-white border border-[#D9D0C3] rounded-3xl p-6 sm:p-8 shadow-sm sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFC8]">
              <h2 className="font-serif text-2xl text-[#17483F] font-normal">
                Order Summary
              </h2>
              <span className="text-xs font-semibold text-[#71977C]">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => {
                const product = item.product || {};
                const displayImg = getProductDisplayImage(product);
                const lineTotal = (product.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={product._id}
                    className="flex items-center gap-3.5 pb-3 border-b border-[#F0EAE1] last:border-b-0"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF6EE] flex-shrink-0 border border-[#E5DCCB]">
                      <img
                        src={displayImg}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = getProductDisplayImage(product, 1);
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-[#17483F] truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#666360]">
                        Qty: <strong className="text-[#17483F]">{item.quantity}</strong> × ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-[#17483F]">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-[#E8DFC8] space-y-2 text-sm">
              <div className="flex justify-between text-[#666360]">
                <span>Subtotal:</span>
                <span className="font-medium text-[#17483F]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-[#666360]">
                <span>Shipping:</span>
                <span className="font-medium text-[#71977C]">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-[#E8DFC8] flex justify-between items-baseline text-base font-bold text-[#17483F]">
                <span className="font-serif text-lg">Total Amount:</span>
                <span className="text-2xl font-serif text-[#17483F]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full rounded-2xl bg-[#17483F] py-4 px-6 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#F7F1E6] transition-all hover:bg-[#0f322b] hover:shadow-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#F7F1E6]/30 border-t-[#F7F1E6]" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Place Order & Pay</span>
                  <span className="text-[#C89A55]">✦</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <Link
                to="/cart"
                className="text-xs text-[#666360] hover:text-[#17483F] transition-colors"
              >
                ← Back to Cart
              </Link>
            </div>

          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;
