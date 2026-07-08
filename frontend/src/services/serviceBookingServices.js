import { readDb, writeDb, normalizePhone } from "./db";

export const ServiceBookingService = {
  /**
   * Get active booking for a specific service ID and phone number.
   * Filters for active statuses (Confirmed, Upcoming, Pending).
   */
  getActiveBooking: (serviceId, phone) => {
    if (!phone || !serviceId) return null;
    const db = readDb();
    const norm = normalizePhone(phone);
    
    if (!db.serviceBookings) {
      db.serviceBookings = {};
      writeDb(db);
      return null;
    }
    
    const bookings = Object.values(db.serviceBookings).filter(
      b => b.serviceId === serviceId && 
           normalizePhone(b.phone) === norm && 
           ["Confirmed", "Upcoming", "Pending"].includes(b.bookingStatus)
    );
    
    if (bookings.length === 0) return null;
    
    // Sort latest first
    bookings.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
    return bookings[0];
  },

  /**
   * Get all service bookings for a phone number.
   */
  getAllBookingsByPhone: (phone) => {
    if (!phone) return [];
    const db = readDb();
    const norm = normalizePhone(phone);
    if (!db.serviceBookings) return [];
    
    return Object.values(db.serviceBookings)
      .filter(b => normalizePhone(b.phone) === norm)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  },

  /**
   * Confirms and persists the service booking and payment records.
   */
  confirmServiceBooking: (bookingData, paymentData) => {
    const db = readDb();
    
    if (!db.serviceBookings) db.serviceBookings = {};
    if (!db.servicePayments) db.servicePayments = {};
    
    const bookingId = `SBK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const paymentId = `SPY-${Date.now()}`;
    const now = new Date().toISOString();
    
    const serviceBooking = {
      bookingId,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      customerId: bookingData.customerId || `c_srv_${Date.now()}`,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      consultationMode: bookingData.consultationMode,
      appointmentDate: bookingData.appointmentDate,
      timeSlot: bookingData.timeSlot,
      paymentId,
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
      createdDate: now,
      updatedDate: now
    };
    
    const servicePayment = {
      paymentId,
      bookingId,
      amount: bookingData.amount,
      paymentStatus: "Successful",
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      createdDate: now
    };
    
    db.serviceBookings[bookingId] = serviceBooking;
    db.servicePayments[paymentId] = servicePayment;
    writeDb(db);
    
    // Save in localStorage for persistence
    localStorage.setItem("seeker_phone", bookingData.phone);
    localStorage.setItem(`active_service_booking_${bookingData.serviceId}`, JSON.stringify(serviceBooking));
    
    return serviceBooking;
  }
};
