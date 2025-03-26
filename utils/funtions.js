import ExcelJS from "exceljs";
import { Ticket, TicketHistory } from "../models/ticketModel.js";
import axios from "axios";
import isEqual from "lodash";

function mergeUniqueServices(services) {
  const uniqueServices = new Map();

  for (const { name, serviceId } of services) {
    if (!uniqueServices.has(serviceId)) {
      uniqueServices.set(serviceId, name);
    } else {
      uniqueServices.set(
        serviceId,
        `${uniqueServices.get(serviceId)}, ${name}`
      );
    }
  }

  return Array.from(uniqueServices, ([serviceId, name]) => ({
    serviceId,
    name,
  }));
}
function formattedData(data) {
  return data.map((item) => ({
    name: item._id === "Crawling, Flying, Garden bug" ? "Others" : item._id, // Handling null _id
    count: item.count,
  }));
}
function areArraysEqual(array1, array2) {
  return isEqual(array1, array2);
}
async function createTicketHistoryEntry(
  ticketNo,
  prevStatus,
  newStatus,
  author
) {
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
}
async function createTicketHistory(ticketNo, author) {
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
}
async function generateExcel(data) {
  try {
    // Create a new workbook and a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");

    // Add header row
    worksheet.columns = [
      { header: "BillToName", key: "billToName", width: 30 },
      { header: "ShipToName", key: "shipToName", width: 30 },
      { header: "ContractNo", key: "contractNo", width: 15 },
      { header: "TicketNo", key: "ticketNo", width: 10 },
      { header: "Problem", key: "problem", width: 50 },
      { header: "Status", key: "status", width: 15 },
      { header: "Services", key: "services", width: 30 },
    ];

    // Add a row with the data
    data.forEach((ticket) => {
      worksheet.addRow({
        billToName: ticket.contract.billToName.trim(),
        shipToName: ticket.contract.shipToName.trim(),
        contractNo: ticket.contract.number,
        ticketNo: ticket.ticketNo,
        problem: ticket.issue.problem.map((p) => p.label).join(", "),
        status: ticket.status,
        services: ticket.contract.selectedServices
          .map((s) => s.name)
          .join(", "),
      });
    });

    // Write to file
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.log("WE encounter error");
  }
}
async function loginToCQR() {
  try {
    const loginResponse = await axios.post(
      "https://cqr1.herokuapp.com/api/login",
      {
        name: process.env.CQR_USER_NAME,
        password: process.env.CQR_USER_PASSWORD,
      }
    );
    return loginResponse.data.token;
  } catch (error) {
    throw new Error("Login to CQR failed!");
  }
}
async function entryToCQR(theTicket) {
  try {
    const token = await loginToCQR();
    const {
      contract: { selectedServices, number: contract },
      scheduledDate,
      ticketImage,
    } = theTicket;
    const image = ticketImage
      ? ticketImage
      : "https://res.cloudinary.com/epcorn/image/upload/v1712651284/ticketNest/tmp-1-1712651281899_rl1suj.png";
    const comments = "All Job Done";
    const completion = "Complete";
    const serviceDate = scheduledDate;

    const servicesArray = mergeUniqueServices(selectedServices);

    for (const service of servicesArray) {
      const { serviceId, name: serviceName } = service;

      try {
        await axios.post(
          `https://cqr1.herokuapp.com/api/ticketReport/${serviceId}`,
          {
            image,
            comments,
            contract,
            completion,
            serviceDate,
            serviceName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        throw new Error(
          `Error sending ticket report for service ${serviceName} (ID: ${serviceId}): ${error.message}`
        );
      }
    }
    return "ok";
  } catch (error) {
    throw new Error(error.message);
  }
}
async function getTicketData() {
  const results = await Ticket.aggregate([
    {
      $project: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: {
          year: "$year",
          month: "$month",
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
  // Process raw aggregation results
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize empty structure
  const ticketData = monthNames.map((month) => ({
    month,
    // Add years dynamically based on your data
    2024: 0,
  }));

  // Fill data
  results.forEach(({ _id, count }) => {
    const monthIndex = _id.month - 1;
    ticketData[monthIndex][_id.year] = count;
  });

  return ticketData;
}

export {
  loginToCQR,
  entryToCQR,
  getTicketData,
  mergeUniqueServices,
  formattedData,
  createTicketHistoryEntry,
  createTicketHistory,
  areArraysEqual,
  generateExcel,
};
