import { Ticket, TicketHistory } from "../models/ticketModel.js";
import { ticketService } from "../services/ticketService.js";
import {
  formattedData,
  generateExcel,
  getTicketData,
} from "../utils/funtions.js";

const create = async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const newTicket = await ticketService.createTicket(rest, req.user);
    res.status(200).json({ message: "Ticket created", ticket: newTicket });
  } catch (error) {
    next(error);
  }
};

const incPrintCount = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.printcount = Number(ticket.printcount) + 1;

    const updatedTicket = await ticket.save();

    return res.status(200).json({
      message: "Print count incremented successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const tickets = await Ticket.find({
      ...(req.query.createdBy && {
        createdBy: { $regex: new RegExp(req.query.createdBy, "i") },
      }),
      ...(req.query.contract && { "contract.number": req.query.contract }),
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.ticketNo && { ticketNo: req.query.ticketNo }),
    })
      .lean()
      .populate("history")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalTickets = await Ticket.countDocuments();
    const todayTickets = await Ticket.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      tickets,
      totalTickets,
      todayTickets,
    });
  } catch (error) {
    next(error);
  }
};

const getTicket = async (req, res, next) => {
  const { ticketId } = req.params;
  const ticket = await Ticket.find({ _id: ticketId })
    .lean()
    .populate("history");

  if (ticket.length <= 0) {
    res.status(404).json({ message: "NO Ticket Found!" });
  }
  res.status(200).json({ ticket: ticket[0] });
};

const update = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const updateData = req.body;

    const ticketExists = await Ticket.exists({ _id: ticketId });
    if (!ticketExists) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Handle status change to "Closed"
    if (updateData.status === "Closed") {
      try {
        const closedTicket = await ticketService.closeTicket(
          updateData,
          req.user
        );
        return res
          .status(200)
          .json({ message: "Ticket Closed!", ticket: closedTicket });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "An error occurred while closing the ticket" });
      }
    }
    // Check if ticket should be marked as Assigned
    const shouldAssign =
      updateData.agent &&
      updateData.scheduledDate &&
      updateData.status === "Open";

    if (shouldAssign) {
      updateData.status = "Assigned";
      try {
        const assignedTicket = await ticketService.assignTicket(
          updateData,
          req.user
        );
        return res
          .status(200)
          .json({ message: "Ticket Assigned!", ticket: assignedTicket });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "An error occurred while assigning the ticket" });
      }
    }

    // Update the ticket document and populate the history field
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "history", select: "changes" })
      .lean();
    return res
      .status(200)
      .json({ message: "Ticket Updated!", ticket: updatedTicket });
  } catch (error) {
    next(error);
  }
};

const cancelTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticketExists = await Ticket.exists({ _id: id });
    if (!ticketExists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const cancelTicket = await ticketService.cancelTicket(id);
    res.status(200).json({ message: "Ticket Canceled!", cancelTicket });
  } catch (error) {
    next(error);
  }
};

const reschedule = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { scheduledDate, scheduledTime, message } = req.body;

    if (!scheduledDate || !scheduledTime || !message) {
      return res.status(403).json({
        message: "Please provide scheduledDate, scheduledTime, and message",
      });
    }
    const ticketExists = await Ticket.exists({ _id: ticketId });
    if (!ticketExists) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const rescheduleTicket = await ticketService.rescheduleTicket(
      ticketId,
      scheduledDate,
      scheduledTime,
      message,
      req.user
    );
    return res.status(200).json({
      message: "Ticket rescheduled successfully",
      ticket: rescheduleTicket,
    });
  } catch (error) {
    next(error);
  }
};

const ticketImage = async (req, res, next) => {
  try {
    const { ticketId, link } = req.body;
    const ticketExists = await Ticket.exists({ _id: ticketId });
    if (!ticketExists) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      { ticketImage: link },
      { new: true }
    )
      .lean()
      .populate({
        path: "history",
        select: "changes",
      });
    return res.status(200).json({
      message: "Ticket updated",
      ticket: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};

const getTicketStatusCounts = async (req, res, next) => {
  try {
    const statusCounts = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const data = statusCounts.map((entry) => ({
      name: entry._id,
      value: entry.count,
    }));

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching ticket status counts:", error);
    return [];
  }
};

const getMonthlyTicketChanges = async (req, res, next) => {
  try {
    const monthStatusPipeline = [
      { $unwind: "$changes" },
      {
        $project: {
          year: { $year: "$changes.timestamp" },
          month: { $month: "$changes.timestamp" },
          status: "$changes.fields.status",
        },
      },
      {
        $group: {
          _id: {
            year: "$year",
            month: "$month",
          },
          open: {
            $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] },
          },
          assigned: {
            $sum: { $cond: [{ $eq: ["$status", "Assigned"] }, 1, 0] },
          },
          closed: {
            $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: {
            $arrayElemAt: [
              [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              "$_id.month",
            ],
          },
          open: 1,
          assigned: 1,
          closed: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    const data = await TicketHistory.aggregate(monthStatusPipeline);
    const ticketData = await getTicketData();
    res.status(200).json({ monthlyTicketStatus: data, yearlyData: ticketData });
  } catch (error) {
    next(error);
  }
};

const genReport = async (req, res, next) => {
  try {
    const data = await Ticket.find(
      {},
      "contract selectedServices issue status ticketNo"
    );
    const excelBuffer = await generateExcel(data);
    // Set response headers and send the file
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ticket_report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (error) {
    next(error);
  }
};

const getStatusAvg = async (req, res, next) => {
  try {
    const pipeline4 = [
      // Unwind the changes array
      { $unwind: "$changes" },

      // Group by ticketNo to reconstruct the ticket history
      {
        $group: {
          _id: "$ticketNo",
          changes: {
            $push: {
              status: "$changes.fields.status",
              timestamp: "$changes.timestamp",
            },
          },
        },
      },

      // Project the required fields and calculate time differences
      {
        $project: {
          ticketNo: "$_id",
          openTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Open"] },
                },
              },
              0,
            ],
          },
          assignedTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Assigned"] },
                },
              },
              0,
            ],
          },
          closedTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Closed"] },
                },
              },
              0,
            ],
          },
        },
      },

      // Calculate time differences only if statuses exist
      {
        $project: {
          openToAssign: {
            $cond: {
              if: { $and: ["$openTime", "$assignedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      "$assignedTime.timestamp",
                      "$openTime.timestamp",
                    ],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
          assignToClose: {
            $cond: {
              if: { $and: ["$assignedTime", "$closedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      "$closedTime.timestamp",
                      "$assignedTime.timestamp",
                    ],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
          openToClose: {
            $cond: {
              if: { $and: ["$openTime", "$closedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: ["$closedTime.timestamp", "$openTime.timestamp"],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
        },
      },

      // Calculate the average response times, ignoring null values
      {
        $group: {
          _id: null,
          avgOpenToAssign: {
            $avg: {
              $cond: [
                { $ne: ["$openToAssign", null] },
                "$openToAssign",
                "$$REMOVE",
              ],
            },
          },
          avgAssignToClose: {
            $avg: {
              $cond: [
                { $ne: ["$assignToClose", null] },
                "$assignToClose",
                "$$REMOVE",
              ],
            },
          },
          avgOpenToClose: {
            $avg: {
              $cond: [
                { $ne: ["$openToClose", null] },
                "$openToClose",
                "$$REMOVE",
              ],
            },
          },
        },
      },

      // Project the final output
      {
        $project: {
          _id: 0,
          avgOpenToAssign: { $round: ["$avgOpenToAssign", 2] },
          avgAssignToClose: { $round: ["$avgAssignToClose", 2] },
          avgOpenToClose: { $round: ["$avgOpenToClose", 2] },
        },
      },
    ];
    const pipeline5 = [
      // Unwind the changes array
      { $unwind: "$changes" },

      // Group by ticketNo to reconstruct the ticket history
      {
        $group: {
          _id: "$ticketNo",
          changes: {
            $push: {
              status: "$changes.fields.status",
              timestamp: "$changes.timestamp",
            },
          },
        },
      },

      // Project the required fields and calculate time differences
      {
        $project: {
          ticketNo: "$_id",
          openTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Open"] },
                },
              },
              0,
            ],
          },
          assignedTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Assigned"] },
                },
              },
              0,
            ],
          },
          closedTime: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$changes",
                  as: "change",
                  cond: { $eq: ["$$change.status", "Closed"] },
                },
              },
              0,
            ],
          },
        },
      },

      // Calculate time differences only if all required statuses exist
      {
        $project: {
          openToAssign: {
            $cond: {
              if: { $and: ["$openTime", "$assignedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      "$assignedTime.timestamp",
                      "$openTime.timestamp",
                    ],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
          assignToClose: {
            $cond: {
              if: { $and: ["$assignedTime", "$closedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: [
                      "$closedTime.timestamp",
                      "$assignedTime.timestamp",
                    ],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
          openToClose: {
            $cond: {
              if: { $and: ["$openTime", "$assignedTime", "$closedTime"] },
              then: {
                $divide: [
                  {
                    $subtract: ["$closedTime.timestamp", "$openTime.timestamp"],
                  },
                  60000, // Convert milliseconds to minutes
                ],
              },
              else: null,
            },
          },
        },
      },

      // Calculate the average response times, ignoring null values
      {
        $group: {
          _id: null,
          totalOpenToAssign: {
            $sum: { $cond: [{ $ne: ["$openToAssign", null] }, 1, 0] },
          },
          sumOpenToAssign: {
            $sum: {
              $cond: [{ $ne: ["$openToAssign", null] }, "$openToAssign", 0],
            },
          },
          totalAssignToClose: {
            $sum: { $cond: [{ $ne: ["$assignToClose", null] }, 1, 0] },
          },
          sumAssignToClose: {
            $sum: {
              $cond: [{ $ne: ["$assignToClose", null] }, "$assignToClose", 0],
            },
          },
          totalOpenToClose: {
            $sum: { $cond: [{ $ne: ["$openToClose", null] }, 1, 0] },
          },
          sumOpenToClose: {
            $sum: {
              $cond: [{ $ne: ["$openToClose", null] }, "$openToClose", 0],
            },
          },
        },
      },

      // Calculate averages and project the final output
      {
        $project: {
          _id: 0,
          avgOpenToAssign: {
            $cond: [
              { $gt: ["$totalOpenToAssign", 0] },
              {
                $round: [
                  { $divide: ["$sumOpenToAssign", "$totalOpenToAssign"] },
                  2,
                ],
              },
              null,
            ],
          },
          avgAssignToClose: {
            $cond: [
              { $gt: ["$totalAssignToClose", 0] },
              {
                $round: [
                  { $divide: ["$sumAssignToClose", "$totalAssignToClose"] },
                  2,
                ],
              },
              null,
            ],
          },
          avgOpenToClose: {
            $cond: [
              { $gt: ["$totalOpenToClose", 0] },
              {
                $round: [
                  { $divide: ["$sumOpenToClose", "$totalOpenToClose"] },
                  2,
                ],
              },
              null,
            ],
          },
        },
      },
    ];
    const data = await TicketHistory.aggregate(pipeline5);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const getServicesCount = async (req, res, next) => {
  try {
    const servicesPipeline = [
      { $unwind: "$contract.selectedServices" },
      {
        $group: { _id: "$contract.selectedServices.name", count: { $sum: 1 } },
      },
    ];
    const d = await Ticket.aggregate(servicesPipeline);
    const data = formattedData(d);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const getInsectsCount = async (req, res, next) => {
  try {
    const insectsPipeline = [
      { $unwind: "$issue.problem" },
      { $group: { _id: "$issue.problem.label", count: { $sum: 1 } } },
    ];
    const d = await Ticket.aggregate(insectsPipeline);
    const data = formattedData(d);
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const jobs = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const assignedJobs = await Ticket.find({ status: "Assigned" });

    const todayJobs = [];
    const tomorrowJobs = [];

    assignedJobs.forEach((job) => {
      if (job.scheduledDate) {
        const jobDate = new Date(job.scheduledDate);
        jobDate.setHours(0, 0, 0, 0);

        if (jobDate.getTime() === today.getTime()) {
          todayJobs.push(job);
        } else if (jobDate.getTime() === tomorrow.getTime()) {
          tomorrowJobs.push(job);
        }
      }
    });

    res.json({ today: todayJobs, tomorrow: tomorrowJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    next(error);
  }
};

export {
  create,
  getTicket,
  getTickets,
  update,
  incPrintCount,
  reschedule,
  ticketImage,
  getTicketStatusCounts,
  getMonthlyTicketChanges,
  getStatusAvg,
  getServicesCount,
  getInsectsCount,
  cancelTicket,
  genReport,
  jobs,
};
