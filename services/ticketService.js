import { Ticket, TicketHistory } from "../models/ticketModel.js";
import { areArraysEqual, entryToCQR } from "../utils/funtions.js";

export const ticketService = {
  async createTicket(ticketData, user) {
    // Check for existing open tickets
    const existingTicket = await this.findExistingOpenTicket(
      ticketData.contract
    );

    if (existingTicket) {
      const alsoSameService = areArraysEqual(
        existingTicket.contract.selectedServices,
        ticketData.contract.selectedServices
      );
      if (alsoSameService) {
        throw new Error(
          `Same ticket is already created by: ${existingTicket.createdBy}, TicketNo: ${existingTicket.ticketNo} but not closed yet!`
        );
      }
    }

    // Create ticket
    const newTicket = await Ticket.create(ticketData);

    // Create ticket history
    await this.createTicketHistory(newTicket.ticketNo, user);

    return newTicket;
  },

  async findExistingOpenTicket(contract) {
    return await Ticket.findOne(
      {
        contract: contract,
        $or: [{ status: "Open" }, { status: "Assigned" }],
      },
      {
        "contract.selectedServices": 1,
        createdBy: 1,
        ticketNo: 1,
      }
    ).sort({ createdAt: -1 });
  },

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
  async closeTicket(ticket) {
    try {
      await entryToCQR(ticket);
    } catch (error) {
      throw new Error("Error while closing ticket", error);
    }
  },
};
