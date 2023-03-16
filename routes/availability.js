const express = require("express");
const availabilityController = require("../controllers/availability");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/new_availability",
  body("date").isDate(),
  body("slots_time_from").isString(),
  body("slots_time_to").isString(),
  body("session_length").isInt(),
  body("break").isInt(),
  availabilityController.addAvailability
);

router.get("/get_availability",availabilityController.getAvailability);

module.exports = router;
