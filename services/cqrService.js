import axios from "axios";
import { mergeUniqueServices } from "../utils/funtions.js";

export const cqrServie = {
  async loginToCQR() {
    try {
      const loginResponse = await axios.post("https://cqr.sat9.in/api/login", {
        name: process.env.CQR_USER_NAME,
        password: process.env.CQR_USER_PASSWORD,
      });
      return loginResponse.data.token;
    } catch (error) {
      throw new Error("Login to CQR failed!");
    }
  },
  async entryToCQR(theTicket) {
    try {
      const token = await this.loginToCQR();
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
            `https://cqr.sat9.in/api/ticketReport/${serviceId}`,
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
  },
};
