/**
 * bookingServices.js
 * Modular services separating business logic and payment integrations from UI.
 * Connects directly to backend Python services using the official Razorpay SDK.
 */

import { toast } from "sonner";
import { readDb, writeDb, normalizePhone } from "./db";
import { CustomerService } from "./customerService";
import { MeetingService } from "./meetingService";

const API_BASE = (process.env.REACT_APP_API_URL || "http://127.0.0.1:8005") + "/api";

const WEEKLY_SCHEDULE = {
  1: ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"], // Monday
  2: ["11:00 AM", "12:00 PM", "05:00 PM"],             // Tuesday
  3: ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"], // Wednesday
  4: ["10:00 AM", "12:30 PM", "02:30 PM", "04:30 PM"], // Thursday
  5: ["09:00 AM", "11:30 AM", "03:00 PM", "05:30 PM"], // Friday
  6: ["10:00 AM", "12:00 PM", "02:00 PM"],             // Saturday
  0: []                                                // Sunday (Closed)
};

const isSlotInPast = (date, slotTimeStr) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (selectedDateStart < todayStart) {
    return true; 
  }
  if (selectedDateStart > todayStart) {
    return false; 
  }
  
  const [time, modifier] = slotTimeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  if (modifier === "PM" && hours < 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }
  
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  
  return slotTime < now;
};

const loadRazorpaySDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      logger("Razorpay Checkout SDK loaded successfully.");
      resolve(true);
    };
    script.onerror = () => {
      reject(new Error("Razorpay Checkout SDK failed to load. Please verify your connection."));
    };
    document.body.appendChild(script);
  });
};

const logger = (msg) => {
  console.log(`[RazorpayIntegration] ${msg}`);
};

export const AvailabilityService = {
  /**
   * Fetches available time slots for a given date by crossing weekly schedules with already-booked slots.
   * @param {Date} date 
   * @returns {Promise<Array<{ time: string, isAvailable: boolean }>>}
   */
  getAvailableSlotsForDate: async (date) => {
    if (!date) return [];
    
    const dayOfWeek = date.getDay();
    const defaultSlots = WEEKLY_SCHEDULE[dayOfWeek] || [];
    const dateKey = date.toISOString().split("T")[0];

    try {
      const response = await fetch(`${API_BASE}/booking/booked-slots?date=${dateKey}`);
      if (!response.ok) {
        throw new Error("Failed to query booked slots from server.");
      }
      const bookedSlots = await response.json();
      const bookedSet = new Set(bookedSlots);

      return defaultSlots.map((slot) => {
        const isBooked = bookedSet.has(slot);
        const isPast = isSlotInPast(date, slot);

        return {
          time: slot,
          isAvailable: !isBooked && !isPast
        };
      });
    } catch (err) {
      console.error("AvailabilityService error:", err);
      // Soft fallback to client calculations on network issues
      return defaultSlots.map((slot) => ({
        time: slot,
        isAvailable: !isSlotInPast(date, slot)
      }));
    }
  }
};

export const RazorpayService = {
  loadSDK: loadRazorpaySDK,
  
  /**
   * Contacts backend to generate a valid Razorpay Order ID.
   */
  createOrder: async (consultationType, date, slot) => {
    const dateKey = new Date(date).toISOString().split("T")[0];
    const response = await fetch(`${API_BASE}/booking/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        consultationType,
        date: dateKey,
        slot
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to create booking order with payment gateway.");
    }

    return await response.json();
  }
};

export const BookingService = {
  /**
   * Records a successfully paid appointment.
   */
  bookAppointment: async (bookingData, paymentData) => {
    const response = await fetch(`${API_BASE}/booking/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        booking: bookingData,
        payment: paymentData
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Booking confirmation failed.");
    }

    const result = await response.json();
    return result.booking;
  },

  getBookingByPhone: (phone) => {
    if (!phone) return null;
    const db = readDb();
    const norm = normalizePhone(phone);
    
    const bookings = Object.values(db.bookings).filter(b => normalizePhone(b.phone) === norm);
    if (bookings.length === 0) return null;
    
    bookings.sort((a, b) => new Date(b.date + " " + b.slot.split(" ")[0]) - new Date(a.date + " " + a.slot.split(" ")[0]));
    
    // Prioritize active booking
    const active = bookings.find(b => ["Pending", "Confirmed", "Upcoming", "Live"].includes(b.status));
    const targetBooking = active || bookings[0];
    
    const meeting = MeetingService.getMeetingForBooking(targetBooking.bookingId);
    if (meeting) {
      targetBooking.meetLink = meeting.meetLink || targetBooking.meetLink;
      targetBooking.chatLink = meeting.chatLink || targetBooking.chatLink;
    }
    
    return targetBooking;
  },

  getActiveBookingByPhone: (phone) => {
    if (!phone) return null;
    const db = readDb();
    const norm = normalizePhone(phone);
    
    const bookings = Object.values(db.bookings).filter(b => normalizePhone(b.phone) === norm);
    if (bookings.length === 0) return null;
    
    bookings.sort((a, b) => new Date(b.date + " " + b.slot.split(" ")[0]) - new Date(a.date + " " + a.slot.split(" ")[0]));
    
    const active = bookings.find(b => ["Pending", "Confirmed", "Upcoming", "Live"].includes(b.status));
    if (active) {
      const meeting = MeetingService.getMeetingForBooking(active.bookingId);
      if (meeting) {
        active.meetLink = meeting.meetLink || active.meetLink;
        active.chatLink = meeting.chatLink || active.chatLink;
      }
      return active;
    }
    return null;
  },

  getAllBookingsByPhone: (phone) => {
    if (!phone) return [];
    const db = readDb();
    const norm = normalizePhone(phone);
    
    const bookings = Object.values(db.bookings).filter(b => normalizePhone(b.phone) === norm);
    return bookings.map(b => {
      const meeting = MeetingService.getMeetingForBooking(b.bookingId);
      if (meeting) {
        b.meetLink = meeting.meetLink || b.meetLink;
        b.chatLink = meeting.chatLink || b.chatLink;
      }
      let refund = null;
      if (db.refunds) {
        refund = Object.values(db.refunds).find(r => r.bookingId === b.bookingId) || null;
      }
      return { ...b, refund };
    }).sort((a, b) => new Date(b.date + " " + b.slot.split(" ")[0]) - new Date(a.date + " " + a.slot.split(" ")[0]));
  },

  getBookingForCustomer: (customerId) => {
    if (!customerId) return null;
    const db = readDb();
    
    const bookings = Object.values(db.bookings).filter(b => b.customerId === customerId);
    if (bookings.length === 0) return null;
    
    bookings.sort((a, b) => new Date(b.date + " " + b.slot.split(" ")[0]) - new Date(a.date + " " + a.slot.split(" ")[0]));
    
    const latestBooking = bookings[0];
    const meeting = MeetingService.getMeetingForBooking(latestBooking.bookingId);
    if (meeting) {
      latestBooking.meetLink = meeting.meetLink || latestBooking.meetLink;
      latestBooking.chatLink = meeting.chatLink || latestBooking.chatLink;
    }
    return latestBooking;
  },

  saveBooking: (bookingDetails) => {
    if (!bookingDetails || !bookingDetails.bookingId) return null;
    const db = readDb();
    db.bookings[bookingDetails.bookingId] = bookingDetails;
    writeDb(db);
    return bookingDetails;
  }
};

// Unified PaymentService coordinates the entire Razorpay popup flow
export const PaymentService = {
  loadRazorpaySDK,
  createOrder: RazorpayService.createOrder,
  confirmBooking: async (bookingPayload, paymentPayload) => {
    const confirmedBooking = await BookingService.bookAppointment(bookingPayload, paymentPayload);
    
    const phone = bookingPayload.phone;
    const customer = CustomerService.getOrCreateCustomer({
      name: bookingPayload.name,
      phone: phone,
      email: bookingPayload.email,
      country: bookingPayload.country
    });

    const db1 = readDb();
    const paymentId = `p_${Date.now()}`;
    const paymentRecord = {
      id: paymentId,
      bookingId: confirmedBooking.bookingId,
      amount: bookingPayload.total || bookingPayload.amount,
      status: "Successful",
      razorpay_order_id: paymentPayload.razorpay_order_id,
      razorpay_payment_id: paymentPayload.razorpay_payment_id,
      razorpay_signature: paymentPayload.razorpay_signature
    };
    db1.payments[paymentId] = paymentRecord;
    writeDb(db1);

    const meeting = MeetingService.createMeeting(confirmedBooking.bookingId, bookingPayload.consultationType);

    const db2 = readDb();
    const consolidatedBooking = {
      ...confirmedBooking,
      customerId: customer.id,
      paymentId: paymentId,
      meetingId: meeting ? meeting.id : null,
      meetLink: meeting ? meeting.meetLink : confirmedBooking.meetLink,
      chatLink: meeting ? meeting.chatLink : confirmedBooking.chatLink,
      status: "Confirmed"
    };
    db2.bookings[consolidatedBooking.bookingId] = consolidatedBooking;
    writeDb(db2);

    CustomerService.addBookingToCustomer(phone, consolidatedBooking.bookingId);

    localStorage.setItem("active_booking", JSON.stringify(consolidatedBooking));

    return consolidatedBooking;
  }
};
