import { Router } from "express";
import userRoute from "./userRoute.js";
import ticketRoute from "./ticketRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/ticket", ticketRoute);

export default router;
