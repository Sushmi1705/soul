import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  CreditCard, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Download
} from "lucide-react";
import { CourseOrderService } from "@/services/courseOrderServices";
import { formatINR } from "@/data/content";
import { toast } from "sonner";
import { readDb, writeDb } from "@/services/db";

const TRACKING_STEPS = [
  { id: "placed", label: "Order Placed", desc: "Your order has been submitted" },
  { id: "payment", label: "Payment Confirmed", desc: "Razorpay payment verified" },
  { id: "verified", label: "Order Verified", desc: "Access review completed by admin" },
  { id: "preparing", label: "Access Preparing", desc: "Setting up virtual classroom details" },
  { id: "activated", label: "Course Activated", desc: "Access keys shared via email/SMS" },
  { id: "completed", label: "Completed", desc: "Onboarding call finished" }
];

const MyOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("orders"); // orders | profile | support
  
  const seekerPhone = localStorage.getItem("seeker_phone") || "";
  const seekerName = localStorage.getItem("seeker_name") || "Seeker";
  const seekerEmail = localStorage.getItem("seeker_email") || "";

  useEffect(() => {
    if (seekerPhone) {
      const allOrders = CourseOrderService.getOrdersByPhone(seekerPhone);
      setOrders(allOrders);
      
      // Auto-load order from query param (e.g. ?id=ORD-XYZ)
      const orderId = searchParams.get("id");
      if (orderId) {
        const match = allOrders.find(o => o.orderId === orderId);
        if (match) setSelectedOrder(match);
      }
    }
  }, [seekerPhone, searchParams]);

  // Dynamic step index mapping
  const getActiveStepIndex = (status) => {
    switch (status) {
      case "Order Placed": return 0;
      case "Payment Successful":
      case "Paid":
        return 1;
      case "Processing": return 2;
      case "Preparing Access": return 3;
      case "Activated": return 4;
      case "Completed": return 5;
      case "Cancelled": return -1;
      case "Refunded": return -2;
      default: return 1;
    }
  };

  // Simulate Order Progress for testing/interactive validation
  const handleSimulateProgress = (newStatus) => {
    if (!selectedOrder) return;
    const db = readDb();
    if (!db.courseOrders) return;
    
    const updatedHistory = [...selectedOrder.statusHistory];
    // Avoid duplicate status updates in timeline
    if (!updatedHistory.find(h => h.status === newStatus)) {
      updatedHistory.push({
        status: newStatus,
        date: new Date().toISOString(),
        comment: `Order status simulated to "${newStatus}".`
      });
    }

    const updatedOrder = {
      ...selectedOrder,
      orderStatus: newStatus,
      statusHistory: updatedHistory,
      updatedDate: new Date().toISOString()
    };
    
    db.courseOrders[selectedOrder.orderId] = updatedOrder;
    writeDb(db);
    
    setSelectedOrder(updatedOrder);
    // Refresh parent list
    setOrders(CourseOrderService.getOrdersByPhone(seekerPhone));
    toast.success(`Order simulated to "${newStatus}"!`);
  };

  const handleDownloadInvoice = (order) => {
    if (!order) return;
    
    const invoiceContent = `
=============================================
         ASTROPOWER24 OFFICIAL INVOICE
=============================================
Invoice Number:    ${order.invoiceNumber}
Date of Purchase:  ${new Date(order.createdDate).toDateString()}
Order ID:          ${order.orderId}
Payment Method:    Razorpay Checkout
Payment ID:        ${order.paymentId}

--- BILLING DETAILS ---
Customer Name:     ${order.customerName}
Phone Number:      ${order.customerPhone}
Email Address:     ${order.customerEmail}
Billing Address:   ${order.billingDetails.address}, ${order.billingDetails.city}, ${order.billingDetails.state} - ${order.billingDetails.pincode}

--- PURCHASED COURSES ---
${order.purchasedCourses.map((c, i) => `${i+1}. ${c.title} (x${c.qty}) - ${formatINR(c.price * c.qty)}`).join("\n")}

---------------------------------------------
Subtotal:          ${formatINR(order.totalAmount)}
Total Paid:        ${formatINR(order.totalAmount)} (INR)
Payment Status:    PAID / SUCCESSFUL
=============================================
Generated on:      ${new Date().toLocaleString()}
Thank you for your order! AstroPower24 Vedic Academy.
`;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice-${order.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Invoice download initiated!");
  };

  return (
    <div className="pt-28 pb-20 bg-[#FDFBF7] min-h-screen text-[#3C2A21] relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Banner */}
        <div className="mb-10 text-left">
          <div className="flex items-center gap-4 mb-3">
            <span className="h-px w-12 bg-[#B38B36]" />
            <span className="text-[10px] tracking-[0.6em] uppercase text-[#B38B36] font-black">Member Sanctum</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">My Account</h1>
        </div>

        {/* Combined Dashboard layout */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
          
          {/* Left Sidebar Menu */}
          <aside className="bg-white border border-[#E5E1D8] rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center gap-3.5 pb-5 border-b border-[#E5E1D8]">
              <div className="w-12 h-12 rounded-full bg-[#B38B36]/10 border border-[#B38B36]/30 flex items-center justify-center font-serif text-[#B38B36] text-xl font-bold uppercase">
                {seekerName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold truncate text-sm">{seekerName}</h3>
                <p className="text-xs text-[#3C2A21]/50 truncate">{seekerEmail || "Cosmic Seeker"}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab("orders");
                  setSelectedOrder(null);
                  setSearchParams({});
                }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "orders" && !selectedOrder
                    ? "bg-[#3C2A21] text-white"
                    : "text-[#3C2A21]/70 hover:bg-[#3C2A21]/5 hover:text-[#3C2A21]"
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  My Orders
                </span>
                <span className="text-[10px] bg-[#B38B36]/10 text-[#B38B36] px-2 py-0.5 rounded-full">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("profile");
                  setSelectedOrder(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "profile"
                    ? "bg-[#3C2A21] text-white"
                    : "text-[#3C2A21]/70 hover:bg-[#3C2A21]/5 hover:text-[#3C2A21]"
                }`}
              >
                <User className="w-4 h-4" />
                Profile details
              </button>

              <button
                onClick={() => {
                  setActiveTab("support");
                  setSelectedOrder(null);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "support"
                    ? "bg-[#3C2A21] text-white"
                    : "text-[#3C2A21]/70 hover:bg-[#3C2A21]/5 hover:text-[#3C2A21]"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                Support Hub
              </button>
            </nav>

            <div className="border-t border-[#E5E1D8] pt-5 space-y-3.5 text-xs text-[#3C2A21]/60">
              <div className="font-bold text-[#3C2A21] text-[10px] uppercase tracking-widest text-[#B38B36]">Office Location</div>
              <p className="leading-relaxed">
                Suite 405, AstroPower Chamber, Cosmic Heights, Sector 62, Noida, UP
              </p>
              <div className="flex justify-between items-center text-[10px]">
                <span>Mon - Sat:</span>
                <span className="font-bold text-[#3C2A21]">10 AM - 7 PM</span>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="bg-white border border-[#E5E1D8] rounded-3xl p-6 md:p-8 min-h-[500px] shadow-sm relative overflow-hidden">
            
            {/* VIEW ORDER DETAILS SCREEN */}
            {selectedOrder ? (
              <div className="space-y-8">
                
                {/* Back button & Admin Simulation Mode */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8]/60 pb-5">
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setSearchParams({});
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B38B36] hover:text-[#3C2A21] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to orders
                  </button>

                  {/* Interactive Status Simulation toolbar */}
                  <div className="bg-[#FAF9F6] border border-[#B38B36]/20 rounded-xl p-2 flex flex-wrap items-center gap-1.5 z-20">
                    <span className="text-[10px] uppercase tracking-wider text-[#B38B36] font-extrabold px-2">
                      Simulate Status:
                    </span>
                    {["Processing", "Preparing Access", "Activated", "Completed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSimulateProgress(s)}
                        className={`text-[9px] font-bold px-2 py-1.5 rounded-lg border transition-all ${
                          selectedOrder.orderStatus === s
                            ? "bg-[#B38B36] text-white border-[#B38B36]"
                            : "bg-white text-[#3C2A21]/70 border-[#E5E1D8] hover:border-[#B38B36]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase bg-[#B38B36]/10 text-[#B38B36] font-bold px-2.5 py-1 rounded-full">
                      Invoice No: {selectedOrder.invoiceNumber}
                    </span>
                    <h2 className="font-serif text-2xl font-bold mt-2 text-[#3C2A21]">
                      Order {selectedOrder.orderId}
                    </h2>
                    <p className="text-xs text-[#3C2A21]/50 mt-1">
                      Placed on {new Date(selectedOrder.createdDate).toLocaleString()} · Est. Activation: 1-2 Hours
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                      className="inline-flex items-center gap-2 border border-[#E5E1D8] text-[#3C2A21] hover:border-[#B38B36] hover:text-[#B38B36] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Invoice
                    </button>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#B38B36] text-white hover:bg-[#9A752B] px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Help
                    </a>
                  </div>
                </div>

                {/* Status Indicator Card */}
                <div className="bg-[#B38B36]/5 border border-[#B38B36]/20 rounded-2xl p-5 flex items-start gap-4">
                  <Sparkles className="w-5 h-5 text-[#B38B36] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase text-[#B38B36] tracking-wider">
                      Current Status: {selectedOrder.orderStatus}
                    </div>
                    <p className="text-xs text-[#3C2A21]/70 leading-relaxed font-medium">
                      {selectedOrder.orderStatus === "Order Placed" && "Your order is placed. Preparing to review security verification parameters."}
                      {selectedOrder.orderStatus === "Processing" && "Cosmic Verification team is reviewing order credentials."}
                      {selectedOrder.orderStatus === "Preparing Access" && "Academy tutors are configuring workspace accounts and downloading lesson blueprints."}
                      {selectedOrder.orderStatus === "Activated" && "Cosmic keys are generated! Check email and messages for credentials."}
                      {selectedOrder.orderStatus === "Completed" && "Course access successfully enabled on workspace. Happy learning!"}
                      {selectedOrder.orderStatus === "Cancelled" && "This order has been cancelled."}
                    </p>
                  </div>
                </div>

                {/* Amazon/Flipkart Style Timeline Tracker */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#B38B36] font-bold">Order Progress Tracking</h3>
                  
                  {/* Cancelled/Refunded Check */}
                  {["Cancelled", "Refunded"].includes(selectedOrder.orderStatus) ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center text-xs text-red-600 font-bold">
                      This order has been {selectedOrder.orderStatus.toLowerCase()}. Any amount charged will be returned to your original payment gateway account.
                    </div>
                  ) : (
                    /* Horizontal Tracking Line (Desktop) & Vertical (Mobile) */
                    <div className="relative py-4">
                      
                      {/* Desktop layout */}
                      <div className="hidden md:flex justify-between items-start relative z-10">
                        {TRACKING_STEPS.map((step, index) => {
                          const currentStepIndex = getActiveStepIndex(selectedOrder.orderStatus);
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          // Check if step history records exist
                          const historyRecord = selectedOrder.statusHistory.find(h => {
                            if (step.id === "placed" && h.status === "Order Placed") return true;
                            if (step.id === "payment" && h.status === "Payment Confirmed") return true;
                            if (step.id === "verified" && h.status === "Processing") return true;
                            if (step.id === "preparing" && h.status === "Preparing Access") return true;
                            if (step.id === "activated" && h.status === "Activated") return true;
                            if (step.id === "completed" && h.status === "Completed") return true;
                            return false;
                          });

                          return (
                            <div key={step.id} className="flex-1 flex flex-col items-center text-center px-2">
                              {/* Circle */}
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? "bg-[#B38B36] border-[#B38B36] text-white" 
                                  : "bg-white border-[#E5E1D8] text-stone-300"
                              } ${isCurrent ? "ring-4 ring-[#B38B36]/20 animate-pulse" : ""}`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                              </div>
                              
                              {/* Label */}
                              <div className={`text-[11px] font-bold mt-3 ${isCompleted ? "text-[#3C2A21]" : "text-stone-400"}`}>
                                {step.label}
                              </div>
                              
                              {/* Date comment */}
                              {historyRecord ? (
                                <div className="text-[9px] text-[#B38B36] mt-0.5 font-bold">
                                  {new Date(historyRecord.date).toLocaleDateString()}
                                </div>
                              ) : (
                                <div className="text-[9px] text-stone-300 mt-0.5">Pending</div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Connection bar (Desktop background line) */}
                      <div className="hidden md:block absolute top-[28px] left-[8%] right-[8%] h-[2px] bg-[#E5E1D8] z-0">
                        <div 
                          className="h-full bg-[#B38B36] transition-all duration-500" 
                          style={{ width: `${(Math.max(0, getActiveStepIndex(selectedOrder.orderStatus)) / 5) * 100}%` }}
                        />
                      </div>

                      {/* Mobile layout (Vertical List) */}
                      <div className="md:hidden space-y-6 relative border-l-2 border-[#E5E1D8] ml-4 pl-6">
                        {TRACKING_STEPS.map((step, index) => {
                          const currentStepIndex = getActiveStepIndex(selectedOrder.orderStatus);
                          const isCompleted = index <= currentStepIndex;
                          const isCurrent = index === currentStepIndex;
                          
                          const historyRecord = selectedOrder.statusHistory.find(h => {
                            if (step.id === "placed" && h.status === "Order Placed") return true;
                            if (step.id === "payment" && h.status === "Payment Confirmed") return true;
                            if (step.id === "verified" && h.status === "Processing") return true;
                            if (step.id === "preparing" && h.status === "Preparing Access") return true;
                            if (step.id === "activated" && h.status === "Activated") return true;
                            if (step.id === "completed" && h.status === "Completed") return true;
                            return false;
                          });

                          return (
                            <div key={step.id} className="relative flex flex-col text-left">
                              {/* Circle indicator on line */}
                              <div className={`absolute left-[-35px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                  ? "bg-[#B38B36] border-[#B38B36] text-white" 
                                  : "bg-white border-[#E5E1D8] text-stone-300"
                              } ${isCurrent ? "ring-4 ring-[#B38B36]/10 animate-pulse" : ""}`}>
                                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3 h-3" />}
                              </div>

                              <div className={`text-xs font-bold ${isCompleted ? "text-[#3C2A21]" : "text-stone-400"}`}>
                                {step.label}
                              </div>
                              <div className="text-[10px] text-stone-500 leading-normal">{step.desc}</div>
                              {historyRecord && (
                                <div className="text-[9px] text-[#B38B36] mt-0.5 font-bold">
                                  {new Date(historyRecord.date).toLocaleString()}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </div>

                {/* Ordered course items card list */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-[#B38B36] font-bold">Purchased Course Details</h3>
                  <div className="border border-[#E5E1D8] rounded-2xl divide-y divide-[#E5E1D8] bg-[#FAF9F6]/20">
                    {selectedOrder.purchasedCourses.map((c) => (
                      <div key={c.id} className="p-4 flex gap-4 items-center">
                        <div className="w-16 h-16 bg-[#F3F1EC] rounded-lg overflow-hidden shrink-0 border border-[#E5E1D8]/60">
                          <img
                            src={c.image}
                            alt={c.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80" }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#3C2A21] truncate">{c.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Quantity: {c.qty}</p>
                        </div>
                        <div className="font-serif text-sm font-bold text-[#3C2A21]">
                          {formatINR(c.price * c.qty)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing details & payment Summary */}
                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  {/* Left Column: Customer Billing address info */}
                  <div className="border border-[#E5E1D8] rounded-2xl p-5 space-y-3.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B38B36] uppercase tracking-wider">
                      <MapPin className="w-4 h-4" />
                      Billing Details
                    </div>
                    <div className="text-xs text-[#3C2A21]/80 space-y-1.5 leading-relaxed">
                      <div><strong className="text-[#3C2A21] font-semibold">Name:</strong> {selectedOrder.customerName}</div>
                      <div><strong className="text-[#3C2A21] font-semibold">Phone:</strong> {selectedOrder.customerPhone}</div>
                      <div><strong className="text-[#3C2A21] font-semibold">Email:</strong> {selectedOrder.customerEmail}</div>
                      <div>
                        <strong className="text-[#3C2A21] font-semibold">Address:</strong> {selectedOrder.billingDetails.address}, {selectedOrder.billingDetails.city}, {selectedOrder.billingDetails.state} - {selectedOrder.billingDetails.pincode}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Payment Details Break-down */}
                  <div className="border border-[#E5E1D8] rounded-2xl p-5 space-y-3.5 bg-[#FAF9F6]/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#B38B36] uppercase tracking-wider">
                      <CreditCard className="w-4 h-4" />
                      Payment Break-down
                    </div>
                    <div className="text-xs space-y-2">
                      <div className="flex justify-between text-[#3C2A21]/70">
                        <span>Paid via Razorpay</span>
                        <span>{formatINR(selectedOrder.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-[#3C2A21]/70">
                        <span>Tax / GST (Included)</span>
                        <span>Included</span>
                      </div>
                      <div className="flex justify-between border-t border-[#E5E1D8] pt-2 font-bold text-sm text-[#3C2A21]">
                        <span>Grand Total Paid</span>
                        <span>{formatINR(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : activeTab === "orders" ? (
              /* TAB: ORDERS LIST VIEW */
              <div>
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3C2A21]">My Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20 border border-[#E5E1D8]/60 border-dashed rounded-3xl">
                    <div className="w-14 h-14 bg-[#F3F1EC] rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-6 h-6 text-[#B38B36]" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#3C2A21] mb-1">No Orders Found</h3>
                    <p className="text-xs text-[#3C2A21]/50 max-w-sm mx-auto mb-6">
                      You haven't enrolled in any courses yet. Begin your journey toward cosmic mastery today.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="bg-[#3C2A21] hover:bg-[#B38B36] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      Explore Courses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={o.orderId}
                        className="border border-[#E5E1D8] rounded-2xl overflow-hidden hover:border-[#B38B36]/30 transition-all shadow-sm hover:shadow-md"
                      >
                        {/* Header Banner of Order card */}
                        <div className="bg-[#FAF9F6] border-b border-[#E5E1D8] px-5 py-3 flex flex-wrap justify-between items-center gap-3 text-[11px] text-[#3C2A21]/60">
                          <div className="flex gap-4">
                            <div>
                              <span className="uppercase tracking-wider font-bold">Placed Date:</span>{" "}
                              <span className="font-bold text-[#3C2A21]">{new Date(o.createdDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="uppercase tracking-wider font-bold">Total:</span>{" "}
                              <span className="font-bold text-[#3C2A21]">{formatINR(o.totalAmount)}</span>
                            </div>
                          </div>
                          <div>
                            <span className="uppercase tracking-wider font-bold">Order ID:</span>{" "}
                            <span className="font-mono font-bold text-[#3C2A21]">{o.orderId}</span>
                          </div>
                        </div>

                        {/* Body of Order card */}
                        <div className="p-5 flex flex-col md:flex-row gap-5 justify-between md:items-center">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-[#F3F1EC] rounded-lg overflow-hidden shrink-0 border border-[#E5E1D8]/60">
                              <img
                                src={o.purchasedCourses[0]?.image}
                                alt={o.purchasedCourses[0]?.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80" }}
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-[#3C2A21] truncate">
                                {o.purchasedCourses[0]?.title}
                                {o.purchasedCourses.length > 1 && ` and ${o.purchasedCourses.length - 1} other course(s)`}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={`w-2 h-2 rounded-full ${
                                  ["Activated", "Completed"].includes(o.orderStatus) ? "bg-emerald-500" : "bg-[#B38B36]"
                                }`} />
                                <span className="text-[10px] uppercase font-bold text-[#3C2A21]/70 tracking-wider">
                                  {o.orderStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setSearchParams({ id: o.orderId });
                              }}
                              className="w-full md:w-auto text-center border border-[#E5E1D8] text-[#3C2A21] hover:border-[#B38B36] hover:text-[#B38B36] px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDownloadInvoice(o)}
                              className="hidden sm:inline-flex items-center gap-1.5 text-stone-500 hover:text-[#B38B36] text-xs font-bold uppercase transition-colors"
                              title="Download Invoice File"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === "profile" ? (
              /* TAB: PROFILE DETAILS VIEW */
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3C2A21]">Profile Details</h2>
                
                <div className="border border-[#E5E1D8] rounded-2xl p-6 bg-[#FAF9F6]/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E5E1D8]/60 text-xs">
                    <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Full Name</span>
                    <span className="font-bold text-[#3C2A21]">{seekerName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-[#E5E1D8]/60 text-xs">
                    <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Email Address</span>
                    <span className="font-bold text-[#3C2A21]">{seekerEmail || "Not Set"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 text-xs">
                    <span className="text-[#3C2A21]/50 font-bold uppercase tracking-wider">Mobile Number</span>
                    <span className="font-bold text-[#3C2A21]">{seekerPhone || "Not Set"}</span>
                  </div>
                </div>

                <div className="bg-[#B38B36]/5 border border-[#B38B36]/20 rounded-2xl p-5 text-xs text-[#3C2A21]/80 leading-relaxed flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#B38B36] shrink-0 mt-0.5" />
                  <p>
                    Your contact information is verified during secure Razorpay checkout order validation. To update your profile, submit new details on your next booking or order placement.
                  </p>
                </div>
              </div>
            ) : (
              /* TAB: SUPPORT HUB VIEW */
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-bold mb-6 text-[#3C2A21]">Academy Support Hub</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Channel Card */}
                  <div className="border border-[#E5E1D8] rounded-2xl p-5 space-y-3">
                    <div className="font-bold text-[#B38B36] text-[11px] uppercase tracking-wider">Contact Channels</div>
                    <div className="space-y-2 text-xs text-[#3C2A21]/80">
                      <div className="flex justify-between">
                        <span className="font-semibold">WhatsApp Chat:</span>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-[#B38B36] font-bold hover:underline">+91 98765 43210</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Support Email:</span>
                        <a href="mailto:support@astropower24.com" className="text-[#B38B36] font-bold hover:underline">support@astropower24.com</a>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Quick Card */}
                  <div className="border border-[#E5E1D8] rounded-2xl p-5 space-y-3">
                    <div className="font-bold text-[#B38B36] text-[11px] uppercase tracking-wider">Course FAQs</div>
                    <div className="space-y-2 text-xs text-[#3C2A21]/80">
                      <div>
                        <strong className="font-semibold block text-[#3C2A21]">How long does activation take?</strong>
                        <span className="text-[11px] text-stone-500">Usually within 1 - 2 hours of payment confirmation.</span>
                      </div>
                      <div>
                        <strong className="font-semibold block text-[#3C2A21]">Can I access it on multiple devices?</strong>
                        <span className="text-[11px] text-stone-500">Yes, workspace logins are fully responsive.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F6] border border-[#E5E1D8] rounded-2xl p-6 text-center">
                  <HelpCircle className="w-10 h-10 text-[#B38B36] mx-auto mb-3.5" />
                  <h4 className="font-bold text-[#3C2A21] text-sm">Need Help With Order Statuses?</h4>
                  <p className="text-stone-500 text-xs mt-1 mb-4 max-w-md mx-auto">
                    If your payment is confirmed but your order verification is pending for over 4 hours, connect with Gitika Sharma's technical academy team.
                  </p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#3C2A21] hover:bg-[#B38B36] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Chat With Tech Support
                  </a>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

export default MyOrdersPage;
