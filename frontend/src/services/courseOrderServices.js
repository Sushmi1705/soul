import { readDb, writeDb, normalizePhone } from "./db";

export const CourseOrderService = {
  /**
   * Get all course orders for a customer phone number.
   */
  getOrdersByPhone: (phone) => {
    if (!phone) return [];
    const db = readDb();
    const norm = normalizePhone(phone);
    if (!db.courseOrders) return [];
    
    return Object.values(db.courseOrders)
      .filter(o => normalizePhone(o.customerPhone) === norm)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  },

  /**
   * Get a single order by ID.
   */
  getOrderById: (orderId) => {
    if (!orderId) return null;
    const db = readDb();
    if (!db.courseOrders) return null;
    return db.courseOrders[orderId] || null;
  },

  /**
   * Confirm a course order and payment details.
   */
  confirmCourseOrder: (orderData, paymentData) => {
    const db = readDb();
    
    if (!db.courseOrders) db.courseOrders = {};
    if (!db.coursePayments) db.coursePayments = {};
    
    const orderId = `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const paymentId = `CPY-${Date.now()}`;
    const invoiceNumber = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();
    
    // Create initial status timeline
    const statusHistory = [
      { status: "Order Placed", date: now, comment: "Order successfully submitted by client." },
      { status: "Payment Confirmed", date: new Date(Date.now() + 10000).toISOString(), comment: "Razorpay signature verified and payment captured." }
    ];

    const courseOrder = {
      orderId,
      customerId: orderData.customerId || `c_course_${Date.now()}`,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      billingDetails: {
        address: orderData.address,
        state: orderData.state,
        city: orderData.city,
        pincode: orderData.pincode
      },
      purchasedCourses: orderData.items, // Array of { id, title, price, image, qty }
      totalAmount: orderData.totalAmount,
      paymentId,
      invoiceNumber,
      paymentStatus: "Paid",
      orderStatus: "Order Placed",
      statusHistory,
      createdDate: now,
      updatedDate: now
    };
    
    const coursePayment = {
      paymentId,
      orderId,
      amount: orderData.totalAmount,
      paymentStatus: "Successful",
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      createdDate: now
    };
    
    db.courseOrders[orderId] = courseOrder;
    db.coursePayments[paymentId] = coursePayment;
    writeDb(db);
    
    // Save customer details in localStorage
    localStorage.setItem("seeker_phone", orderData.customerPhone);
    localStorage.setItem("seeker_name", orderData.customerName);
    localStorage.setItem("seeker_email", orderData.customerEmail);
    
    return courseOrder;
  }
};
