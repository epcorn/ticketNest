import { TicketHistory } from "../models/ticketModel.js";

export const ticketHistoryService = {
  async createTicketHistoryEntry(ticketNo, prevStatus, newStatus, author) {
    const ticketHistory = await TicketHistory.findOne({ ticketNo });

    const newChange = {
      fields: { status: newStatus },
      message: `Status changed from ${prevStatus} to ${newStatus}`,
      author: author.username,
    };

    if (ticketHistory) {
      ticketHistory.changes.push(newChange);
      await ticketHistory.save();
    } else {
      const newTicketHistory = new TicketHistory({
        ticketNo,
        changes: [newChange],
      });
      await newTicketHistory.save();
    }
  },
  async createTicketHistory(ticketNo, author) {
    const newChange = {
      fields: { status: "Open" },
      message: "Ticket created with Open status",
      author: author.username,
    };

    const newTicketHistory = new TicketHistory({
      ticketNo,
      changes: [newChange],
    });

    await newTicketHistory.save();
  },
  async ticketHistoryRechedule(ticketNo, message, author, fields) {
    newChange = {
      fields,
      message,
      author: author.username,
    };
    await TicketHistory.findByIdAndUpdate(
      { ticketNo },
      { $push: { changes: newChange } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
};
