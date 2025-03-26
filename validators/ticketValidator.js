import { body } from "express-validator";

// Validation rules for updating ticket
exports.validateTicketUpdate = [
  body("contract").notEmpty().withMessage("Agent cannot be empty"),
  body("date").optional().isISO8601().withMessage("Date must be a valid date"),
  body("status")
    .optional()
    .isIn(["Open", "Assigned", "Closed"])
    .withMessage("Invalid status value"),
];
