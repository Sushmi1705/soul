import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/data/content";
import { toast } from "sonner";
import { PaymentService } from "@/services/bookingServices";
import { CourseOrderService } from "@/services/courseOrderServices";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clear } =
    useCart();
  const [stage, setStage] = useState("cart"); // cart | checkout | placed
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    email: "", 
    address: "",
    state: "",
    city: "",
    pincode: ""
  });

  // Load user info from localStorage if available
  useEffect(() => {
    if (isOpen) {
      const storedName = localStorage.getItem("seeker_name") || "";
      const storedEmail = localStorage.getItem("seeker_email") || "";
      const storedPhone = localStorage.getItem("seeker_phone") || "";
      setForm((prev) => ({
        ...prev,
        name: storedName,
        email: storedEmail,
        phone: storedPhone
      }));
    }
  }, [isOpen]);

  const reset = () => {
    setTimeout(() => {
      setStage("cart");
      setPlacedOrder(null);
      setLoading(false);
      setForm({ 
        name: "", 
        phone: "", 
        email: "", 
        address: "",
        state: "",
        city: "",
        pincode: ""
      });
    }, 300);
  };

  const handleClose = (v) => {
    setIsOpen(v);
    if (!v) reset();
  };

  const handlePlace = async () => {
    if (!form.name || !form.phone || !form.email || !form.address || !form.state || !form.city || !form.pincode) {
      toast.error("Please fill in all mandatory billing fields.");
      return;
    }
    if (form.phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      // 1. Load Razorpay SDK Script
      await PaymentService.loadRazorpaySDK();

      // 2. Generate Razorpay Order on backend (reusing standard /booking/create-order)
      const orderDetails = await PaymentService.createOrder(
        "video", // Fallback consultationType to pass validation and generate Razorpay Order ID
        new Date(),
        "12:00 PM"
      );

      // 3. Setup Razorpay Checkout options
      const options = {
        key: orderDetails.key_id,
        amount: total * 100, // Total price in paise
        currency: "INR",
        name: "Astro Power 24",
        description: `Purchasing courses: ${items.map(i => i.title).join(", ")}`,
        order_id: orderDetails.order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: {
          color: "#B38B36"
        },
        handler: async (response) => {
          try {
            const orderData = {
              customerName: form.name,
              customerPhone: form.phone,
              customerEmail: form.email,
              address: form.address,
              state: form.state,
              city: form.city,
              pincode: form.pincode,
              items: items,
              totalAmount: total
            };

            const paymentData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            // Confirm order locally on frontend DB
            const confirmedOrder = CourseOrderService.confirmCourseOrder(orderData, paymentData);
            setPlacedOrder(confirmedOrder);
            setStage("placed");
            toast.success("Order placed successfully!");
            clear();
          } catch (err) {
            toast.error("Order processing failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment was cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        toast.error("Payment transaction failed. Please try again.");
      });
      rzp.open();

    } catch (err) {
      toast.error(err.message || "Failed to launch Razorpay gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent
        data-testid="cart-drawer"
        className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#E5E1D8] p-0 flex flex-col"
      >
        <SheetHeader className="p-6 border-b border-[#E5E1D8]">
          <SheetTitle className="font-serif text-2xl text-[#3C2A21] flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[#B38B36]" />
            {stage === "cart" && "Your Cart"}
            {stage === "checkout" && "Billing Details"}
            {stage === "placed" && "Order Completed"}
          </SheetTitle>
        </SheetHeader>

        {/* CART STAGE */}
        {stage === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div
                  data-testid="cart-empty-state"
                  className="flex flex-col items-center justify-center h-full text-center py-20"
                >
                  <div className="w-16 h-16 rounded-full bg-[#F3F1EC] flex items-center justify-center mb-5">
                    <Sparkles className="w-7 h-7 text-[#B38B36]" />
                  </div>
                  <h3 className="font-serif text-2xl text-[#3C2A21] mb-2 font-bold">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-[#725D46] max-w-xs">
                    Begin your journey — explore our courses and add one to your
                    path.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((i) => (
                    <div
                      key={i.id}
                      data-testid={`cart-item-${i.id}`}
                      className="flex gap-4 bg-white border border-[#E5E1D8] rounded-xl p-3"
                    >
                      <div className="w-20 h-20 bg-[#F3F1EC] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={i.image}
                          alt={i.title}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] tracking-[0.2em] uppercase text-[#725D46] font-bold">
                          {i.category}
                        </div>
                        <h4 className="font-serif text-base text-[#3C2A21] truncate font-bold">
                          {i.title}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="inline-flex items-center border border-[#E5E1D8] rounded-full bg-white">
                            <button
                              data-testid={`cart-decrement-${i.id}`}
                              onClick={() => updateQty(i.id, i.qty - 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#3C2A21] hover:text-[#B38B36]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold">
                              {i.qty}
                            </span>
                            <button
                              data-testid={`cart-increment-${i.id}`}
                              onClick={() => updateQty(i.id, i.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center text-[#3C2A21] hover:text-[#B38B36]"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-serif text-[#3C2A21] font-bold">
                            {formatINR(i.price * i.qty)}
                          </div>
                        </div>
                      </div>
                      <button
                        data-testid={`cart-remove-${i.id}`}
                        onClick={() => removeItem(i.id)}
                        className="self-start text-[#725D46] hover:text-[#B38B36] p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-[#E5E1D8] p-6 bg-white space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs tracking-[0.25em] uppercase text-[#725D46] font-bold">
                    Subtotal
                  </span>
                  <span
                    data-testid="cart-subtotal"
                    className="font-serif text-2xl text-[#3C2A21] font-bold"
                  >
                    {formatINR(total)}
                  </span>
                </div>
                <button
                  data-testid="checkout-button"
                  onClick={() => setStage("checkout")}
                  className="w-full bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.25em] uppercase py-4 rounded-full transition-all duration-300 font-bold"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {/* CHECKOUT STAGE */}
        {stage === "checkout" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                Full Name *
              </label>
              <input
                data-testid="checkout-input-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                Mobile Number *
              </label>
              <input
                data-testid="checkout-input-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                placeholder="10-digit phone number"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                Email Address *
              </label>
              <input
                data-testid="checkout-input-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                Billing Address *
              </label>
              <textarea
                data-testid="checkout-input-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36] resize-none"
                rows={2}
                placeholder="Street address, building, suite"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                  City *
                </label>
                <input
                  data-testid="checkout-input-city"
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                  State *
                </label>
                <input
                  data-testid="checkout-input-state"
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                  placeholder="State"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-1.5 font-bold">
                Pincode *
              </label>
              <input
                data-testid="checkout-input-pincode"
                type="text"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#B38B36]"
                placeholder="6-digit PIN code"
              />
            </div>

            <div className="border-t border-[#E5E1D8] pt-4 space-y-2">
              <div className="flex justify-between text-xs text-[#725D46]">
                <span>Items Subtotal</span>
                <span>{items.reduce((s, i) => s + i.qty, 0)} items</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs tracking-[0.25em] uppercase text-[#725D46] font-bold">
                  Total
                </span>
                <span className="font-serif text-2xl text-[#3C2A21] font-bold">
                  {formatINR(total)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                data-testid="checkout-back-button"
                onClick={() => setStage("cart")}
                className="flex-1 border border-[#E5E1D8] text-[#3C2A21] hover:border-[#B38B36] hover:text-[#B38B36] text-xs tracking-[0.25em] uppercase py-3.5 rounded-full transition-all"
              >
                Back
              </button>
              <button
                data-testid="place-order-button"
                disabled={loading}
                onClick={handlePlace}
                className="flex-1 bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.25em] uppercase py-3.5 rounded-full transition-all flex items-center justify-center gap-2 font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#E5C06A]" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </div>
        )}

        {/* PLACED STAGE */}
        {stage === "placed" && placedOrder && (
          <div
            data-testid="order-placed-state"
            className="flex-1 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#B38B36]" />
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-emerald-600 font-bold mb-1">
                Payment Success
              </div>
              <div className="text-[10px] tracking-[0.4em] uppercase text-[#725D46] mb-3">
                Order Placed
              </div>
              <h3 className="font-serif text-2xl text-[#3C2A21] mb-2 font-bold">
                Thank you,{" "}
                <em className="italic text-[#B38B36]">
                  {form.name.split(" ")[0]}
                </em>
              </h3>
              <p className="text-xs text-[#725D46] max-w-xs mb-6">
                Your order is confirmed. A receipt and access instructions have been sent to{" "}
                <span className="text-[#B38B36] font-bold">{form.email}</span>.
              </p>

              {/* Enhanced Order Card */}
              <div className="w-full bg-[#3C2A21]/5 border border-[#E5E1D8] rounded-xl p-5 text-left text-xs space-y-3.5 mb-6">
                <div className="flex justify-between border-b border-[#E5E1D8]/60 pb-2">
                  <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Order ID</span>
                  <span className="font-mono font-bold text-[#3C2A21]">{placedOrder.orderId}</span>
                </div>
                <div className="border-b border-[#E5E1D8]/60 pb-2">
                  <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider block mb-1.5">Purchased Courses</span>
                  <div className="space-y-1">
                    {placedOrder.purchasedCourses.map((c) => (
                      <div key={c.id} className="flex justify-between font-medium text-[#3C2A21]">
                        <span>{c.title} (x{c.qty})</span>
                        <span>{formatINR(c.price * c.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between border-b border-[#E5E1D8]/60 pb-2">
                  <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Total Paid</span>
                  <span className="font-bold text-[#3C2A21]">{formatINR(placedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Processing Time</span>
                  <span className="font-bold text-[#B38B36]">Within 1 - 2 hours</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    handleClose(false);
                    // Navigate to the My Orders page
                    window.location.href = `/my-orders?id=${placedOrder.orderId}`;
                  }}
                  className="w-full bg-[#3C2A21] hover:bg-[#B38B36] text-white text-xs tracking-[0.25em] uppercase py-3.5 rounded-full transition-all font-bold"
                >
                  View Order
                </button>
                <button
                  onClick={() => handleClose(false)}
                  className="w-full border border-[#E5E1D8] text-[#3C2A21] hover:border-[#B38B36] hover:text-[#B38B36] text-xs tracking-[0.25em] uppercase py-3.5 rounded-full transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
