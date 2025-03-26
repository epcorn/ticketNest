import { Router } from "express";
import {
  create,
  entryToCQR,
  getTicket,
  getTickets,
  incPrintCount,
  update,
  reschedule,
  ticketImage,
  getTicketStatusCounts,
  getMonthlyTicketChanges,
  getInsectsCount,
  getServicesCount,
  getStatusAvg,
  cancelTicket,
  genReport,
  jobs,
} from "../controller/ticketController.js";
import { verifyToken, ifAdmin } from "../middleware/verifyUser.js";

const router = Router();

router.post("/", verifyToken, create);
router.get("/getTickets", verifyToken, getTickets);
router.get("/:ticketId", verifyToken, getTicket);
router.put("/:ticketId", verifyToken, update);
router.get("/:ticketId/cqr", verifyToken, entryToCQR);
router.get("/print/:ticketId", verifyToken, incPrintCount);
router.post("/reschedule/:ticketId", verifyToken, reschedule);
router.get("/cancel/:id", verifyToken, ifAdmin, cancelTicket);
router.post("/updateImage", verifyToken, ticketImage);
router.get("/stats/ticketStatusCounts", verifyToken, getTicketStatusCounts);
router.get("/stats/getMonthlyStat", verifyToken, getMonthlyTicketChanges);
router.get("/stats/insectsCount", verifyToken, getInsectsCount);
router.get("/stats/serviceCount", verifyToken, getServicesCount);
router.get("/stats/statusAvg", verifyToken, getStatusAvg);
router.get("/reports/r1", verifyToken, genReport);
router.get("/reports/jobs/", jobs);

export default router;
