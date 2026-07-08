/**
 * db.js
 * Manages local storage persistence for a mock relational database.
 */

const DB_KEY = "soul_app_database";

const getTodayDateStr = () => new Date().toISOString().split("T")[0];

const getFutureDateStr = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
};

const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

const getRelativeSlotString = (hoursOffset) => {
  const d = new Date();
  d.setHours(d.getHours() + hoursOffset);
  let hours = d.getHours();
  const minutes = "00";
  const modifier = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${modifier}`;
};

const INITIAL_MOCK_DATA = {
  customers: {
    "9876543210": { id: "c_1", name: "John Seeker", phone: "9876543210", email: "john@example.com" },
    "9876543211": { id: "c_2", name: "Jane Seeker", phone: "9876543211", email: "jane@example.com" },
    "9876543212": { id: "c_3", name: "Bob Seeker", phone: "9876543212", email: "bob@example.com" },
    "9876543213": { id: "c_4", name: "Alice Seeker", phone: "9876543213", email: "alice@example.com" },
    "9876543214": { id: "c_5", name: "Charlie Seeker", phone: "9876543214", email: "charlie@example.com" },
    "9876543215": { id: "c_6", name: "David Seeker", phone: "9876543215", email: "david@example.com" }
  },
  bookings: {
    "BK-88A9F3": {
      bookingId: "BK-88A9F3",
      customerId: "c_1",
      name: "John Seeker",
      phone: "9876543210",
      email: "john@example.com",
      consultationType: "video",
      date: getFutureDateStr(2),
      slot: "04:00 PM",
      duration: "45 mins",
      amount: "2359",
      status: "Upcoming",
      paymentId: "p_1",
      meetingId: "m_1"
    },
    "BK-123456": {
      bookingId: "BK-123456",
      customerId: "c_2",
      name: "Jane Seeker",
      phone: "9876543211",
      email: "jane@example.com",
      consultationType: "chat",
      date: getTodayDateStr(),
      slot: getRelativeSlotString(0),
      duration: "45 mins",
      amount: "1179",
      status: "Live Now",
      paymentId: "p_2",
      meetingId: "m_2"
    },
    "BK-777888": {
      bookingId: "BK-777888",
      customerId: "c_3",
      name: "Bob Seeker",
      phone: "9876543212",
      email: "bob@example.com",
      consultationType: "voice",
      date: getPastDateStr(1),
      slot: "10:00 AM",
      duration: "45 mins",
      amount: "1769",
      status: "Completed",
      paymentId: "p_3",
      meetingId: "m_3"
    },
    "BK-999000": {
      bookingId: "BK-999000",
      customerId: "c_4",
      name: "Alice Seeker",
      phone: "9876543213",
      email: "alice@example.com",
      consultationType: "voice",
      date: getTodayDateStr(),
      slot: getRelativeSlotString(2),
      duration: "45 mins",
      amount: "1769",
      status: "Today's Meeting",
      paymentId: "p_4",
      meetingId: "m_4"
    },
    "BK-654321": {
      bookingId: "BK-654321",
      customerId: "c_5",
      name: "Charlie Seeker",
      phone: "9876543214",
      email: "charlie@example.com",
      consultationType: "video",
      date: getTodayDateStr(),
      slot: "03:00 PM",
      duration: "45 mins",
      amount: "2359",
      status: "Cancelled",
      paymentId: "p_5",
      meetingId: "m_5"
    },
    "BK-111222": {
      bookingId: "BK-111222",
      customerId: "c_6",
      name: "David Seeker",
      phone: "9876543215",
      email: "david@example.com",
      consultationType: "video",
      date: getPastDateStr(3),
      slot: "02:00 PM",
      duration: "45 mins",
      amount: "2359",
      status: "Expired",
      paymentId: "p_6",
      meetingId: "m_6"
    }
  },
  payments: {
    "p_1": { id: "p_1", bookingId: "BK-88A9F3", amount: "2359", status: "Successful", razorpay_payment_id: "pay_test_88A9F3" },
    "p_2": { id: "p_2", bookingId: "BK-123456", amount: "1179", status: "Successful", razorpay_payment_id: "pay_test_123456" },
    "p_3": { id: "p_3", bookingId: "BK-777888", amount: "1769", status: "Successful", razorpay_payment_id: "pay_test_777888" },
    "p_4": { id: "p_4", bookingId: "BK-999000", amount: "1769", status: "Successful", razorpay_payment_id: "pay_test_999000" },
    "p_5": { id: "p_5", bookingId: "BK-654321", amount: "2359", status: "Successful", razorpay_payment_id: "pay_test_654321" },
    "p_6": { id: "p_6", bookingId: "BK-111222", amount: "2359", status: "Successful", razorpay_payment_id: "pay_test_111222" }
  },
  meetings: {
    "m_1": { id: "m_1", bookingId: "BK-88A9F3", meetLink: "https://meet.google.com/abc-defg-hij", status: "Upcoming" },
    "m_2": { id: "m_2", bookingId: "BK-123456", chatLink: "https://chat.example.com/live/BK-123456", status: "Live Now" },
    "m_3": { id: "m_3", bookingId: "BK-777888", status: "Completed" },
    "m_4": { id: "m_4", bookingId: "BK-999000", meetLink: "https://meet.google.com/xyz-pdq-rst", status: "Today's Meeting" },
    "m_5": { id: "m_5", bookingId: "BK-654321", status: "Cancelled" },
    "m_6": { id: "m_6", bookingId: "BK-111222", status: "Expired" }
  },
  reports: {},
  report_mappings: {}
};

export const readDb = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
      return INITIAL_MOCK_DATA;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read from localStorage mock database:", e);
    return INITIAL_MOCK_DATA;
  }
};

export const writeDb = (data) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to write to localStorage mock database:", e);
  }
};

export const normalizePhone = (phone) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
};
