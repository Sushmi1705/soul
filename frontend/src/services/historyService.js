/**
 * historyService.js
 * Contains search, filter, and invoice/receipt details logic for the consultation booking history.
 */

import { readDb, normalizePhone } from "./db";
import { MeetingService } from "./meetingService";

export const HistoryService = {
  /**
   * Retrieves all bookings for a user by phone, sorted newest first.
   * @param {string} phone
   * @returns {Array}
   */
  getBookingsByPhone: (phone) => {
    if (!phone) return [];
    const db = readDb();
    const norm = normalizePhone(phone);
    
    // Filter bookings matching customer phone number
    const userBookings = Object.values(db.bookings).filter(b => normalizePhone(b.phone) === norm);
    
    // Enrich with meetings and refund info if exists
    return userBookings.map(booking => {
      const meeting = MeetingService.getMeetingForBooking(booking.bookingId) || null;
      let refund = null;
      if (db.refunds) {
        refund = Object.values(db.refunds).find(r => r.bookingId === booking.bookingId) || null;
      }
      return {
        ...booking,
        meeting,
        refund
      };
    }).sort((a, b) => {
      // Sort newest date first
      const dateA = new Date(a.date + " " + a.slot.split(" ")[0]);
      const dateB = new Date(b.date + " " + b.slot.split(" ")[0]);
      return dateB - dateA;
    });
  },

  /**
   * Filters and searches history bookings.
   * @param {Array} bookings
   * @param {string} filter - 'All', 'Upcoming', 'Completed', 'Cancelled', 'Refunded'
   * @param {string} searchQuery
   * @returns {Array}
   */
  filterAndSearchBookings: (bookings, filter, searchQuery) => {
    let result = [...bookings];

    // Filter by status category
    if (filter && filter !== "All") {
      result = result.filter(booking => {
        const status = booking.status || "Pending";
        if (filter === "Upcoming") {
          return ["Pending", "Confirmed", "Upcoming", "Live"].includes(status);
        }
        if (filter === "Completed") {
          return status === "Completed";
        }
        if (filter === "Cancelled") {
          return ["Cancelled by Customer", "Cancelled by Admin", "Cancelled"].includes(status);
        }
        if (filter === "Refunded") {
          return ["Refund Initiated", "Refund Completed"].includes(booking.refund?.status || "") || 
                 ["Refund Initiated", "Refund Completed"].includes(booking.status);
        }
        return true;
      });
    }

    // Search query matching Booking ID, Meeting Date, or Consultation Type
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(booking => {
        const idMatch = booking.bookingId?.toLowerCase().includes(query);
        const typeMatch = booking.consultationType?.toLowerCase().includes(query);
        const dateMatch = new Date(booking.date).toDateString().toLowerCase().includes(query) || 
                          booking.date?.includes(query);
        return idMatch || typeMatch || dateMatch;
      });
    }

    return result;
  },

  /**
   * Generates receipt details payload.
   * @param {object} booking
   */
  getReceiptDetails: (booking) => {
    if (!booking) return null;
    return {
      receiptNumber: `REC-${booking.bookingId.replace("AP-", "")}`,
      bookingId: booking.bookingId,
      date: new Date(booking.date).toDateString(),
      slot: booking.slot,
      consultationType: booking.consultationType,
      amountPaid: booking.amount || booking.total || 499.0,
      paymentMethod: "Razorpay Checkout",
      paymentId: booking.paymentId || "RP_MOCK_PAYMENT",
      customerName: booking.name,
      customerEmail: booking.email,
      customerPhone: booking.phone,
      status: booking.status
    };
  }
};
