import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../Services/api";
import { getProductDisplayImage } from "../utils/curatedImages";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load your orders. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchOrders);
  }, [fetchOrders]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "CONFIRMED":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "SHIPPED":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E6] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#D9D0C3] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#71977C] mb-1">
              <span>Account</span>
              <span>/</span>
              <span className="text-[#17483F]">Purchase History</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#17483F] font-normal">
              My Orders 🧾
            </h1>
            <p className="text-sm text-[#666360] mt-1">
              Track previous purchases, delivery statuses, and invoices.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[#17483F] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#17483F] hover:bg-[#F7F1E6] transition shadow-sm self-start sm:self-auto"
          >
            <span>Continue Shopping</span>
            <span>→</span>
          </Link>
        </div>

        {/* State 1: Loading State */}
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#17483F]/20 border-t-[#17483F] mb-4" />
            <p className="font-serif text-lg text-[#17483F]">
              Loading your purchase history...
            </p>
          </div>
        )}

        {/* State 2: Error State */}
        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-3xl p-8 sm:p-10 text-center max-w-md mx-auto my-12 shadow-sm">
            <span className="text-4xl block mb-3">⚠️</span>
            <h2 className="font-serif text-2xl text-[#17483F] mb-1">
              Unable to load orders
            </h2>
            <p className="text-sm text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="rounded-full bg-[#17483F] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b] transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white border border-[#D9D0C3] rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-[#FAF6EE] text-[#17483F] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-[#E5DCCB]">
              📦
            </div>
            <h2 className="font-serif text-2xl text-[#17483F] mb-2">
              You have not placed any orders yet.
            </h2>
            <p className="text-sm text-[#666360] mb-6 leading-relaxed">
              When you complete a checkout, your verified purchase receipt will be saved here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#17483F] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F7F1E6] hover:bg-[#0f322b] transition shadow"
            >
              <span>Start Shopping</span>
              <span className="text-[#C89A55]">✦</span>
            </Link>
          </div>
        )}

        {/* State 4: Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              });

              return (
                <div
                  key={order._id}
                  className="bg-white border border-[#D9D0C3] rounded-3xl p-6 sm:p-8 shadow-sm transition hover:border-[#17483F]/30 hover:shadow-md"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8DFC8] gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-xl font-bold text-[#17483F]">
                          Order #{order._id?.slice(-8)}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status || "PLACED"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF2EC] text-[#17483F]">
                          {order.paymentStatus || "PAID"}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E8A85] mt-0.5">
                        Placed on {formattedDate}
                      </p>
                    </div>

                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <span className="text-xs text-[#8E8A85] block">Total Amount</span>
                      <span className="font-serif text-2xl font-bold text-[#17483F]">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="py-4 divide-y divide-[#F0EAE1]">
                    {order.items?.map((item, idx) => {
                      const displayImg = getProductDisplayImage({ image: item.image, name: item.name });
                      const linePrice = item.price * item.quantity;

                      return (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF6EE] flex-shrink-0 border border-[#E5DCCB]">
                              <img
                                src={displayImg}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = getProductDisplayImage({ name: item.name }, 1);
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#17483F] truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-[#666360]">
                                {item.name} × <strong className="text-[#17483F]">{item.quantity}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="text-xs text-[#666360]">
                              (₹{item.price?.toLocaleString("en-IN")} each)
                            </span>
                            <span className="block text-sm font-semibold text-[#17483F]">
                              ₹{linePrice?.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-4 border-t border-[#E8DFC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-[#666360] flex items-center gap-2">
                      <span className="text-[#C89A55]">✦</span>
                      <span>
                        Delivering to: <strong className="text-[#17483F]">{order.shippingAddress?.city || "Customer Address"}</strong>
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17483F] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F7F1E6] hover:bg-[#0f322b] transition shadow-sm"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </Link>
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

export default Orders;
