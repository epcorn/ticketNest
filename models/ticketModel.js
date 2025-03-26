import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TicketHistorySchema = new Schema({
  ticketNo: {
    type: Number,
    required: true,
  },
  changes: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      fields: {
        type: Object,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
    },
  ],
});

const TicketSchema = new Schema(
  {
    ticketNo: {
      type: Number,
      unique: true,
    },
    contract: {
      type: Object,
      required: true,
    },
    complainMode: {
      type: String,
      enum: ["phone", "email", "inspection"],
    },
    modeDetails: {
      type: Object,
    },
    issue: { type: Object },
    createdBy: { type: String },
    status: {
      type: String,
      enum: ["Open", "Assigned", "Closed", "Canceled"],
      default: "Open",
    },
    agent: {
      type: String,
      default: "",
    },
    scheduledTime: {
      type: String,
      default: "",
    },
    scheduledDate: {
      type: String,
      default: "",
    },
    resource: {
      type: String,
      default: "",
    },
    printcount: {
      type: Number,
      default: 0,
    },
    ticketImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

TicketSchema.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    const highestTicket = await this.constructor
      .findOne({}, "ticketNo")
      .sort({ ticketNo: -1 })
      .limit(1);

    const newTicketNo = (highestTicket ? highestTicket.ticketNo : 0) + 1;
    this.ticketNo = newTicketNo;
    next();
  } catch (error) {
    next(error);
  }
});

TicketSchema.pre("remove", async function () {
  const ticketHistory = await TicketHistory.findOne({
    ticketNo: this.ticketNo,
  });
  if (ticketHistory) {
    await TicketHistory.deleteOne({ _id: ticketHistory._id });
  }
});

TicketSchema.virtual("history", {
  ref: "TicketHistory",
  localField: "ticketNo",
  foreignField: "ticketNo",
  justOne: true,
});

const Ticket = mongoose.model("Ticket", TicketSchema);
const TicketHistory = mongoose.model("TicketHistory", TicketHistorySchema);

export { Ticket, TicketHistory };
