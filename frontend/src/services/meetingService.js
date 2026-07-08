import { readDb, writeDb } from "./db";

export const MeetingService = {
  createMeeting: (bookingId, consultationType) => {
    if (!bookingId || !consultationType) return null;
    const db = readDb();
    
    const id = `m_${Date.now()}`;
    const newMeeting = {
      id,
      bookingId,
      consultationType,
      status: "Upcoming"
    };

    if (consultationType === "video" || consultationType === "voice") {
      const randomCodes = Math.random().toString(36).substring(2, 5) + "-" + 
                           Math.random().toString(36).substring(2, 6) + "-" + 
                           Math.random().toString(36).substring(2, 5);
      newMeeting.meetLink = `https://meet.google.com/${randomCodes}`;
    } else if (consultationType === "chat") {
      newMeeting.chatLink = `https://chat.example.com/live/${bookingId}`;
    }

    db.meetings[id] = newMeeting;
    writeDb(db);
    return newMeeting;
  },

  getMeetingForBooking: (bookingId) => {
    if (!bookingId) return null;
    const db = readDb();
    
    const meeting = Object.values(db.meetings).find(m => m.bookingId === bookingId);
    return meeting || null;
  },

  updateMeetingStatus: (meetingId, status) => {
    if (!meetingId || !status) return;
    const db = readDb();
    if (db.meetings[meetingId]) {
      db.meetings[meetingId].status = status;
      writeDb(db);
    }
  }
};
