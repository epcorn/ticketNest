import brevo from "@getbrevo/brevo";

export const ticketRaised = async (data, assignedBy = "EPCON") => {
  const {
    contract: {
      number,
      billToName,
      billToAddress,
      shipToName,
      shipToAddress,
      billToEmails,
      shipToEmails,
    },
    complainMode,
    scheduledDate,
    scheduledTime,
    ticketNo,
    issue: { problem, location, details },
    createdAt,
    createdBy,
  } = data;
  const { date: raisedDate, time: raisedTime } = convertToIndianTime(createdAt);
  const sendEmailTo =
    billToEmails[0] || shipToEmails[0] || process.NO_REPLY_EMAIL;
  try {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_KEY_V3;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "EPCORN",
      //email: process.env.SALES_EMAIL,
      email: process.env.NO_REPLY_EMAIL,
    };
    //sendSmtpEmail.to = [{ email: sendEmailTo }];
    sendSmtpEmail.to = [{ email: process.env.NO_REPLY_EMAIL }];
    sendSmtpEmail.templateId = 10;
    sendSmtpEmail.params = {
      number,
      billToName,
      billToAddress,
      shipToName,
      shipToAddress,
      complainMode,
      scheduledDate,
      scheduledTime,
      problem,
      location,
      details,
      ticketNo,
      createdBy,
      raisedDate,
      raisedTime,
      assignedBy,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error("Failed to send transactional email");
  }
};

function convertToIndianTime(createdAt) {
  // Create a new Date object from the given timestamp
  const date = new Date(createdAt);

  // Create a DateTimeFormat instance for the Asia/Kolkata time zone
  const formatter = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Format the date and time
  const formattedDateTime = formatter.format(date);

  // Split the formatted string into date and time components
  const [formattedDate, formattedTime] = formattedDateTime.split(", ");

  // Return the formatted date and time
  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export const ticketClosed = async (data, closedBy = "EPCON") => {
  const {
    contract: { number, shipToAddress, billToEmails, shipToEmails },
    ticketNo,
    scheduledDate,
    scheduledTime,
    issue: { problem, location, details },
  } = data;
  const sendEmailTo =
    billToEmails[0] || shipToEmails[0] || process.NO_REPLY_EMAIL;
  try {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_KEY_V3;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "EPCORN",
      //email: process.env.SALES_EMAIL,
      email: process.env.NO_REPLY_EMAIL,
    };
    //sendSmtpEmail.to = [{ email: sendEmailTo }];
    sendSmtpEmail.to = [{ email: process.env.NO_REPLY_EMAIL }];
    sendSmtpEmail.templateId = 12;
    sendSmtpEmail.params = {
      number,
      shipToAddress,
      scheduledDate,
      problem: extractLabelsAsString(problem),
      ticketNo,
      closedBy,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error("Failed to send transactional email");
  }
};

export const ticketRescheduled = async (data, assignedBy = "EPCON") => {
  const {
    contract: {
      number,
      billToName,
      billToAddress,
      shipToName,
      shipToAddress,
      billToEmails,
      shipToEmails,
    },
    complainMode,
    scheduledDate,
    scheduledTime,
    ticketNo,
    issue: { problem, location, details },
    createdAt,
    createdBy,
  } = data;
  const { date: raisedDate, time: raisedTime } = convertToIndianTime(createdAt);
  const sendEmailTo =
    billToEmails[0] || shipToEmails[0] || process.NO_REPLY_EMAIL;
  try {
    let defaultClient = brevo.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_KEY_V3;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
      name: "EPCORN",
      //email: process.env.SALES_EMAIL,
      email: process.env.NO_REPLY_EMAIL,
    };
    //sendSmtpEmail.to = [{ email: sendEmailTo }];
    sendSmtpEmail.to = [{ email: process.env.NO_REPLY_EMAIL }];
    sendSmtpEmail.templateId = 14;
    sendSmtpEmail.params = {
      number,
      billToName,
      billToAddress,
      shipToName,
      shipToAddress,
      complainMode,
      scheduledDate,
      scheduledTime,
      problem,
      location,
      details,
      ticketNo,
      createdBy,
      raisedDate,
      raisedTime,
      assignedBy,
    };
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error("Failed to send transactional email");
  }
};

function extractLabelsAsString(data) {
  return data.map((item) => item.label).join(", ");
}
