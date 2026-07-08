import { readDb, writeDb, normalizePhone } from "./db";

export const CustomerService = {
  getCustomerByPhone: (phone) => {
    if (!phone) return null;
    const db = readDb();
    const norm = normalizePhone(phone);
    return Object.values(db.customers).find(c => normalizePhone(c.phone) === norm) || null;
  },

  createCustomer: (customerData) => {
    if (!customerData || !customerData.phone) return null;
    const db = readDb();
    
    const id = customerData.id || `c_${Date.now()}`;
    const newCustomer = {
      id,
      name: customerData.name || "Seeker",
      phone: customerData.phone,
      email: customerData.email || "",
      dob: customerData.dob || "",
      tob: customerData.tob || "",
      pob: customerData.pob || "",
      country: customerData.country || "",
      city: customerData.city || "",
      reportIds: customerData.reportIds || [],
      bookingIds: customerData.bookingIds || []
    };

    db.customers[customerData.phone] = newCustomer;
    writeDb(db);
    return newCustomer;
  },

  getOrCreateCustomer: (customerData) => {
    if (!customerData || !customerData.phone) return null;
    const existing = CustomerService.getCustomerByPhone(customerData.phone);
    if (existing) {
      const db = readDb();
      const updated = {
        ...existing,
        name: customerData.name || existing.name,
        email: customerData.email || existing.email,
        dob: customerData.dob || existing.dob,
        tob: customerData.tob || existing.tob,
        pob: customerData.pob || existing.pob,
        country: customerData.country || existing.country,
        city: customerData.city || existing.city
      };
      db.customers[existing.phone] = updated;
      writeDb(db);
      return updated;
    }
    return CustomerService.createCustomer(customerData);
  },

  addBookingToCustomer: (phone, bookingId) => {
    if (!phone || !bookingId) return;
    const db = readDb();
    const norm = normalizePhone(phone);
    const customerKey = Object.keys(db.customers).find(k => normalizePhone(k) === norm);
    if (customerKey) {
      const customer = db.customers[customerKey];
      if (!customer.bookingIds) customer.bookingIds = [];
      if (!customer.bookingIds.includes(bookingId)) {
        customer.bookingIds.push(bookingId);
        db.customers[customerKey] = customer;
        writeDb(db);
      }
    }
  },

  addReportToCustomer: (phone, reportId) => {
    if (!phone || !reportId) return;
    const db = readDb();
    const norm = normalizePhone(phone);
    const customerKey = Object.keys(db.customers).find(k => normalizePhone(k) === norm);
    if (customerKey) {
      const customer = db.customers[customerKey];
      if (!customer.reportIds) customer.reportIds = [];
      if (!customer.reportIds.includes(reportId)) {
        customer.reportIds.push(reportId);
        db.customers[customerKey] = customer;
        writeDb(db);
      }
    }
  }
};
