import { readDb, writeDb } from "./db";

export const RefundService = {
  processRefund: (bookingId, scenario) => {
    if (!bookingId || !scenario) return null;
    const db = readDb();
    
    const refundId = `ref_${Date.now()}`;
    const refundRecord = {
      id: refundId,
      bookingId,
      timestamp: new Date().toISOString()
    };

    if (scenario === "customer") {
      refundRecord.status = "Not Eligible";
      refundRecord.reason = "Cancelled by Customer";
      refundRecord.amount = 0;
    } else {
      refundRecord.status = "Refund Initiated";
      refundRecord.expectedRefund = "Within 24 Hours";
      refundRecord.amount = "100%";
    }

    db.refunds = db.refunds || {};
    db.refunds[refundId] = refundRecord;
    writeDb(db);

    return refundRecord;
  }
};

export const NotificationService = {
  sendNotification: (booking, scenario) => {
    if (!booking) return;
    
    const formattedDate = new Date(booking.date).toDateString();
    
    if (scenario === "customer") {
      console.log(`[Notification Alert] SMS/WhatsApp Sent to Seeker (${booking.phone}): "Your consultation (ID: ${booking.bookingId}) has been successfully cancelled by you. As per policy, it is non-refundable."`);
      console.log(`[Notification Alert] Email Sent to Seeker (${booking.email}): "Booking Cancelled Confirmation for ID: ${booking.bookingId}."`);
      console.log(`[Notification Alert] Alert Sent to Admin: "Seeker ${booking.name} (Phone: ${booking.phone}) has cancelled their consultation (ID: ${booking.bookingId}) scheduled for ${formattedDate} @ ${booking.slot}."`);
    } else if (scenario === "admin") {
      console.log(`[Notification Alert] SMS/WhatsApp Sent to Seeker (${booking.phone}): "Your consultation (ID: ${booking.bookingId}) has been cancelled by the astrologer. A 100% refund of ₹${booking.amount || booking.total} has been initiated and will process within 24 hours."`);
      console.log(`[Notification Alert] Email Sent to Seeker (${booking.email}): "Booking Cancelled & Refund Initiated. ID: ${booking.bookingId}."`);
    }
  }
};

export const CancellationService = {
  cancelBookingByCustomer: async (bookingId) => {
    if (!bookingId) throw new Error("Booking ID is required.");
    
    // Simulate slight processing delay for validation loading indicators
    await new Promise(resolve => setTimeout(resolve, 800));

    const db = readDb();
    const booking = db.bookings[bookingId];
    if (!booking) throw new Error("Booking not found.");
    
    if (booking.status === "Cancelled by Customer" || booking.status === "Cancelled by Admin") {
      throw new Error("This consultation has already been cancelled.");
    }
    
    if (booking.status === "Completed") {
      throw new Error("Cannot cancel a completed consultation.");
    }

    // Update statuses
    booking.status = "Cancelled by Customer";
    
    // Update meeting status if associated
    if (booking.meetingId && db.meetings[booking.meetingId]) {
      db.meetings[booking.meetingId].status = "Cancelled";
    }

    db.bookings[bookingId] = booking;
    writeDb(db);

    // Process refund
    const refund = RefundService.processRefund(bookingId, "customer");
    booking.refund = refund;

    // Send notifications
    NotificationService.sendNotification(booking, "customer");

    // Persist active booking status if it was active
    const active = localStorage.getItem("active_booking");
    if (active) {
      const activeObj = JSON.parse(active);
      if (activeObj.bookingId === bookingId) {
        localStorage.setItem("active_booking", JSON.stringify({ ...booking, refund }));
      }
    }

    return { booking, refund };
  },

  cancelBookingByAdmin: async (bookingId) => {
    if (!bookingId) throw new Error("Booking ID is required.");
    
    // Simulate slight processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const db = readDb();
    const booking = db.bookings[bookingId];
    if (!booking) throw new Error("Booking not found.");
    
    if (booking.status === "Cancelled by Customer" || booking.status === "Cancelled by Admin") {
      throw new Error("This consultation has already been cancelled.");
    }
    
    if (booking.status === "Completed") {
      throw new Error("Cannot cancel a completed consultation.");
    }

    // Update statuses
    booking.status = "Cancelled by Admin";
    
    if (booking.meetingId && db.meetings[booking.meetingId]) {
      db.meetings[booking.meetingId].status = "Cancelled";
    }

    db.bookings[bookingId] = booking;
    writeDb(db);

    // Process refund
    const refund = RefundService.processRefund(bookingId, "admin");
    booking.refund = refund;

    // Send notifications
    NotificationService.sendNotification(booking, "admin");

    const active = localStorage.getItem("active_booking");
    if (active) {
      const activeObj = JSON.parse(active);
      if (activeObj.bookingId === bookingId) {
        localStorage.setItem("active_booking", JSON.stringify({ ...booking, refund }));
      }
    }

    return { booking, refund };
  }
};
