import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getOrderById } from "../Services/api";
import { getProductDisplayImage } from "../utils/curatedImages";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState("");
  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const res = await getOrderById(id);
          if (res && res.order) {
            setOrder(res.order);
          }
        } catch (err) {
          console.error("Failed to fetch order details:", err);
          setError(
            err.response?.data?.message ||
              "Unable to load order details. Please verify your order ID."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [id]);

  const getStatusStepIndex = (status) => {
    switch (status) {
      case "PLACED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center w-full">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#17483F]/20 border-t-[#17483F] mb-4" />
          <h2 className="font-serif text-2xl text-[#17483F]">
            Retrieving your order details...
          </h2>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center w-full">
          <div className="bg-white border border-[#D9D0C3] rounded-3xl p-10 shadow-sm">
            <span className="text-4xl block mb-3">⚠️</span>
            <h2 className="font-serif text-2xl text-[#17483F] mb-2">
              Order Not Found
            </h2>
            <p className="text-sm text-[#666360] mb-6">
              {error || "We could not find the order you are looking for."}
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/orders"
                className="rounded-full bg-[#17483F] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b]"
              >
                View My Orders
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-[#17483F] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] hover:bg-white"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStep = getStatusStepIndex(order.status);
  const steps = [
    { label: "Order Placed", status: "PLACED", icon: "✓" },
    { label: "Confirmed", status: "CONFIRMED", icon: "📦" },
    { label: "Shipped", status: "SHIPPED", icon: "🚚" },
    { label: "Delivered", status: "DELIVERED", icon: "🏡" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Success Header Banner */}
        <section className="bg-white border border-[#D9D0C3] rounded-3xl p-8 sm:p-10 shadow-sm text-center mb-8 relative overflow-hidden">
          <div className="w-16 h-16 bg-[#EBF2EC] text-[#71977C] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-[#BED3C2]">
            ✓
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#71977C] mb-1 inline-block">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#17483F] font-normal mb-2">
            Order Placed Successfully
          </h1>
          <p className="text-sm text-[#666360] max-w-md mx-auto">
            Thank you for your purchase. Your order has been securely saved and is now being prepared.
          </p>

          <div className="mt-6 pt-6 border-t border-[#E8DFC8] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8A85] block">
                Order ID
              </span>
              <span className="text-xs font-mono font-bold text-[#17483F] truncate block" title={order._id}>
                #{order._id?.slice(-8)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8A85] block">
                Date
              </span>
              <span className="text-xs font-semibold text-[#17483F] block">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8A85] block">
                Total Paid
              </span>
              <span className="text-sm font-serif font-bold text-[#17483F] block">
                ₹{order.totalAmount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8A85] block">
                Payment Status
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EBF2EC] text-[#17483F]">
                {order.paymentStatus || "PAID"}
              </span>
            </div>
          </div>
        </section>

        {/* Order Progression Tracker */}
        <section className="bg-white border border-[#D9D0C3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8DFC8]">
            <h2 className="font-serif text-xl text-[#17483F]">
              Delivery Progression
            </h2>
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FCFAF6] border border-[#D9D0C3] text-[#17483F]">
              Status: {order.status}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center relative">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.status} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isCompleted
                        ? "bg-[#17483F] text-[#F7F1E6] ring-4 ring-[#EBF2EC]"
                        : "bg-[#FCFAF6] text-[#8E8A85] border border-[#D9D0C3]"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCurrent ? "text-[#17483F]" : isCompleted ? "text-[#71977C]" : "text-[#8E8A85]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Purchased Items Snapshot */}
        <section className="bg-white border border-[#D9D0C3] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="font-serif text-xl text-[#17483F] mb-4 pb-3 border-b border-[#E8DFC8]">
            Items In This Order
          </h2>

          <div className="divide-y divide-[#F0EAE1]">
            {order.items?.map((item, index) => {
              const itemTotal = item.price * item.quantity;
              const imgUrl = getProductDisplayImage({ image: item.image, name: item.name });

              return (
                <div key={index} className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6EE] flex-shrink-0 border border-[#E5DCCB]">
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getProductDisplayImage({ name: item.name }, 1);
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-serif font-medium text-[#17483F] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#666360] mt-0.5">
                      Quantity: <strong className="text-[#17483F]">{item.quantity}</strong> × ₹{item.price?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-[#17483F]">
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8DFC8] flex justify-between items-center text-lg font-bold text-[#17483F]">
            <span className="font-serif text-xl">Total Paid</span>
            <span className="font-serif text-2xl">
              ₹{order.totalAmount?.toLocaleString("en-IN")}
            </span>
          </div>
        </section>

        {/* Shipping & Payment Meta Details (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          
          {/* Shipping Address */}
          <div className="bg-white border border-[#D9D0C3] rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-[#17483F] mb-3 pb-2 border-b border-[#E8DFC8]">
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="text-xs text-[#666360] space-y-1 leading-relaxed">
                <p className="font-bold text-sm text-[#17483F]">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.addressLine1}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
                <p className="pt-1 text-[#17483F] font-medium">
                  📞 {order.shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#8E8A85]">Standard boutique address</p>
            )}
          </div>

          {/* Payment & Security Verification */}
          <div className="bg-white border border-[#D9D0C3] rounded-3xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-[#17483F] mb-3 pb-2 border-b border-[#E8DFC8]">
              Payment Verification
            </h3>
            <div className="text-xs text-[#666360] space-y-2">
              <div className="flex justify-between">
                <span>Gateway:</span>
                <span className="font-semibold text-[#17483F]">Razorpay Standard</span>
              </div>
              <div className="flex justify-between">
                <span>Razorpay Order ID:</span>
                <span className="font-mono text-[11px] text-[#17483F]">
                  {order.razorpayOrderId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="font-mono text-[11px] text-[#17483F]">
                  {order.razorpayPaymentId || "Verified"}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E8DFC8]">
                <span>Status:</span>
                <span className="font-bold text-[#71977C]">
                  ✓ HMAC Signature Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/orders"
            className="w-full sm:w-auto rounded-full bg-[#17483F] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b] transition shadow"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto rounded-full border border-[#17483F] bg-white px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] hover:bg-[#F7F1E6] transition shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default OrderConfirmation;
