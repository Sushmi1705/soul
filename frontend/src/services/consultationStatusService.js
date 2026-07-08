/**
 * consultationStatusService.js
 * Intelligently manages and queries consultation bookings and calculates real-time statuses.
 */

import { BookingService } from "./bookingServices";

const getSlotDateTime = (dateStr, slotStr) => {
  if (!dateStr || !slotStr) return new Date();
  const date = new Date(dateStr);
  const [time, modifier] = slotStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const ConsultationStatusService = {
  getBookingByPhone: (phone) => {
    if (!phone) return null;
    
    const booking = BookingService.getBookingByPhone(phone);
    if (booking) {
      const currentStatus = ConsultationStatusService.getCalculatedStatus(booking);
      return { ...booking, calculatedStatus: currentStatus };
    }
    
    return null;
  },
  
  getCalculatedStatus: (booking) => {
    if (!booking) return null;
    if (booking.status === "Cancelled by Customer") {
      return "Cancelled by Customer";
    }
    if (booking.status === "Cancelled by Admin") {
      return "Cancelled by Admin";
    }
    if (booking.status === "Cancelled" || booking.status === "cancelled") {
      return "Cancelled";
    }
    if (booking.status === "Expired" || booking.status === "expired") {
      return "Expired";
    }
    
    const start = getSlotDateTime(booking.date, booking.slot);
    const durationMins = booking.consultationType === "in-person" ? 60 : 45;
    const end = new Date(start.getTime() + durationMins * 60 * 1000);
    const now = new Date();
    
    if (now >= start && now <= end) {
      return "Live Now";
    } else if (now > end) {
      return "Completed";
    } else {
      const isToday = start.toDateString() === now.toDateString();
      if (isToday) {
        return "Today's Meeting";
      }
      return "Upcoming";
    }
  },

  getSlotDateTime
};
