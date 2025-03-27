import { Ticket } from "../models/ticketModel.js";
import { areArraysEqual } from "../utils/funtions.js";
import { cqrServie } from "./cqrService.js";
import { emailService } from "./emailService.js";
import { ticketHistoryService } from "./ticketHistoryService.js";

export const ticketService = {
  async createTicket(ticketData, user) {
    // Check for existing open tickets
    const existingTicket = await this.findExistingOpenTicket(
      ticketData.contract.number
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
    await ticketHistoryService.createTicketHistory(newTicket.ticketNo, user);

    return newTicket;
  },
  async assignTicket(ticketData, user) {
    try {
      await emailService.ticketRaised(ticketData, user.username);
      await ticketHistoryService.createTicketHistoryEntry(
        ticketData.ticketNo,
        "Open",
        "Assigned",
        user
      );
      const assignedTicket = await Ticket.findByIdAndUpdate(
        ticketData._id,
        ticketData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate({ path: "history", select: "changes" })
        .lean();

      return assignedTicket;
    } catch (error) {
      throw new Error("Error while Assigning ticket", error);
    }
  },
  async rescheduleTicket(
    ticketId,
    scheduledDate,
    scheduledTime,
    message,
    user
  ) {
    try {
      const existingTicket = await Ticket.findById(ticketId).lean();

      const rescheduleTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          scheduledDate,
          scheduledTime,
        },
        { new: true }
      )
        .populate({
          path: "history",
          select: "changes",
        })
        .lean();
      await ticketHistoryService.ticketHistoryRechedule(
        rescheduleTicket.history._id,
        message,
        user,
        {
          scheduledDate: existingTicket.scheduledDate,
          scheduledTime: existingTicket.scheduledTime,
        }
      );
      await emailService.ticketRescheduled(rescheduleTicket, user.username);
      return rescheduleTicket;
    } catch (error) {
      console.log(error);
      throw new Error("Error while rescheduling ticket", error);
    }
  },
  async closeTicket(ticket, user) {
    try {
      await cqrServie.entryToCQR(ticket);

      const closedTicket = await Ticket.findByIdAndUpdate(ticket._id, ticket, {
        new: true,
        runValidators: true,
      })
        .populate({ path: "history", select: "changes" }) // Populate before lean()
        .lean();
      await ticketHistoryService.createTicketHistoryEntry(
        ticket.ticketNo,
        "Assigned",
        "Closed",
        user
      );
      await emailService.ticketClosed(ticket, user.username);
      return closedTicket;
    } catch (error) {
      console.log(error);
      throw new Error("Error while closing ticket", error);
    }
  },
  async cancelTicket(ticketId) {
    try {
      const cancelTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        { $set: { status: "Canceled" } },
        { new: true }
      )
        .populate({ path: "history", select: "changes" }) // Populate before lean()
        .lean();
      return cancelTicket;
    } catch (error) {
      throw new Error("Error while cancel ticket", error);
    }
  },
  async findExistingOpenTicket(contractNo) {
    return await Ticket.findOne(
      {
        "contract.number": contractNo,
        $or: [{ status: "Open" }, { status: "Assigned" }],
      },
      {
        "contract.selectedServices": 1,
        createdBy: 1,
        ticketNo: 1,
      }
    ).sort({ createdAt: -1 });
  },
};
