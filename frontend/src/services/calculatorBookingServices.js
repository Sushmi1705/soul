import { readDb, writeDb, normalizePhone } from "./db";

export const CalculatorBookingService = {
  /**
   * Fetch all bookings for a mobile number and calculator ID.
   * Returns active bookings (CONFIRMED) first.
   */
  getActiveBooking: (mobile, calculatorId) => {
    if (!mobile || !calculatorId) return null;
    const db = readDb();
    if (!db.calculatorBookings) return null;

    const normMobile = normalizePhone(mobile);
    return Object.values(db.calculatorBookings).find(
      (b) =>
        normalizePhone(b.mobile) === normMobile &&
        b.calculatorId === calculatorId &&
        b.bookingStatus === "CONFIRMED"
    ) || null;
  },

  /**
   * Get slots that are already booked for a specific date.
   */
  getBookedSlotsForDate: (dateStr) => {
    if (!dateStr) return [];
    const db = readDb();
    if (!db.calculatorBookings) return [];

    return Object.values(db.calculatorBookings)
      .filter((b) => b.consultationDate === dateStr && b.bookingStatus === "CONFIRMED")
      .map((b) => b.timeSlot);
  },

  /**
   * Confirm booking and write to local database.
   */
  confirmBooking: (bookingData, paymentData) => {
    const db = readDb();
    
    if (!db.calculatorBookings) db.calculatorBookings = {};
    if (!db.calculatorPayments) db.calculatorPayments = {};

    const bookingId = `CBK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const paymentId = paymentData.razorpay_payment_id || `CPY-${Date.now()}`;
    const now = new Date().toISOString();

    const bookingRecord = {
      bookingId,
      customerName: bookingData.customerName,
      email: bookingData.email,
      mobile: bookingData.mobile,
      calculatorId: bookingData.calculatorId,
      calculatorName: bookingData.calculatorName,
      calculatorType: bookingData.calculatorType,
      calculatorResultId: bookingData.calculatorResultId || "MOCK-RES-108",
      consultationDate: bookingData.consultationDate,
      timeSlot: bookingData.timeSlot,
      consultationMode: bookingData.consultationMode,
      paymentId,
      paymentStatus: "Paid",
      bookingStatus: "CONFIRMED",
      createdDate: now,
      updatedDate: now
    };

    const paymentRecord = {
      paymentId,
      bookingId,
      amount: bookingData.amount || 1100, // standard consultation fee
      paymentStatus: "Successful",
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      createdDate: now
    };

    db.calculatorBookings[bookingId] = bookingRecord;
    db.calculatorPayments[paymentId] = paymentRecord;
    writeDb(db);

    // Save customer details in localStorage
    localStorage.setItem("seeker_phone", bookingData.mobile);
    localStorage.setItem("seeker_name", bookingData.customerName);
    localStorage.setItem("seeker_email", bookingData.email);

    return bookingRecord;
  },

  /**
   * Cancel a booking by ID.
   * Enforces the 24-hour cancellation rule.
   */
  cancelBooking: (bookingId) => {
    const db = readDb();
    if (!db.calculatorBookings) return { success: false, message: "Booking database not found." };
    
    const booking = db.calculatorBookings[bookingId];
    if (!booking) return { success: false, message: "Booking not found." };

    if (booking.bookingStatus !== "CONFIRMED") {
      return { success: false, message: "Only confirmed bookings can be cancelled." };
    }

    // Check 24-hour rule
    // Schedule timestamp computation
    try {
      const dateParts = booking.consultationDate.split("-"); // yyyy-mm-dd
      const slotTimeStr = booking.timeSlot.split(" - ")[0]; // e.g. "10:00 AM"
      
      // Parse slot hour/minute/am-pm
      const [time, ampm] = slotTimeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (ampm.toLowerCase() === "pm" && hours < 12) hours += 12;
      if (ampm.toLowerCase() === "am" && hours === 12) hours = 0;

      const scheduleDate = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2]),
        hours,
        minutes
      );

      const diffMs = scheduleDate.getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 24) {
        return {
          success: false,
          message: "Cancellation is only allowed up to 24 hours before the consultation start time."
        };
      }
    } catch (e) {
      console.error("Failed to parse schedule date for cancellation check:", e);
    }

    // Cancel booking
    db.calculatorBookings[bookingId].bookingStatus = "Cancelled";
    db.calculatorBookings[bookingId].updatedDate = new Date().toISOString();
    writeDb(db);

    return { success: true, message: "Consultation successfully cancelled. Slot has been released." };
  }
};
