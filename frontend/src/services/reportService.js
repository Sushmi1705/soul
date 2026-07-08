import { readDb, writeDb } from "./db";
import { CustomerService } from "./customerService";

const API_BASE = (process.env.REACT_APP_API_URL || "http://127.0.0.1:8005") + "/api";

export const ReportService = {
  generateReport: async (payload) => {
    const customerData = {
      name: payload.name || "Seeker",
      phone: payload.phone,
      email: payload.email || "",
      dob: payload.dob || "",
      tob: payload.tob || "",
      pob: payload.pob || "",
      country: payload.country || "",
      city: payload.pob || ""
    };
    const customer = CustomerService.getOrCreateCustomer(customerData);

    const response = await fetch(`${API_BASE}/horoscope/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to generate report");
    }

    const data = await response.json();
    
    if (data && data.id) {
      ReportService.mapReportToCustomer(data.id, payload.phone);
      
      const db = readDb();
      db.reports[data.id] = data;
      writeDb(db);
    }

    return data;
  },

  getReport: async (reportId) => {
    const response = await fetch(`${API_BASE}/horoscope/reports/${reportId}`);
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to load report");
    }

    const data = await response.json();
    
    if (data && data.phone) {
      ReportService.mapReportToCustomer(reportId, data.phone);
      
      CustomerService.getOrCreateCustomer({
        name: data.name,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        tob: data.tob,
        pob: data.pob
      });

      const db = readDb();
      db.reports[reportId] = data;
      writeDb(db);
    }

    return data;
  },

  mapReportToCustomer: (reportId, phone) => {
    if (!reportId || !phone) return;
    const db = readDb();
    
    if (!db.report_mappings) db.report_mappings = {};
    db.report_mappings[reportId] = phone;
    
    writeDb(db);

    CustomerService.addReportToCustomer(phone, reportId);
  },

  getCustomerPhoneByReportId: (reportId) => {
    if (!reportId) return null;
    const db = readDb();
    if (db.report_mappings && db.report_mappings[reportId]) {
      return db.report_mappings[reportId];
    }
    if (db.reports && db.reports[reportId]) {
      return db.reports[reportId].phone;
    }
    return null;
  }
};
