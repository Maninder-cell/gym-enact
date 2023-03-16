const { validationResult } = require("express-validator");
const db = require("../models");
const moment = require("moment");
const Availability = db.Availability;
const Slot = db.Slot;
const { Op } = require("sequelize");

const createSlots = async (id, user_id) => {
  const availability = await Availability.findOne({ where: { id: id } });

  //starting time
  let startTime = moment(availability.slots_time_from, "HH:mm:ss");
  //ending time
  let endTime = moment(startTime, "HH:mm:ss").add(
    availability.session_length,
    "minutes"
  );

  //convert slot_time_to into momentjs native format
  const slots_time_to = moment(availability.slots_time_to, "HH:mm:ss");

  while (endTime <= slots_time_to) {
    //slot data
    const slot_data = {
      user_id: user_id,
      start: startTime.format("hh:mm a"),
      end: endTime.format("hh:mm a"),
      availability_id: availability.id,
    };

    //creating slot
    await Slot.create(slot_data);

    //updating starting time
    startTime = endTime.add(
        availability.break,
        "minutes"
      );;

    //updating ending time
    endTime = moment(startTime, "HH:mm:ss").add(
      availability.session_length,
      "minutes"
    );

    if (endTime > slots_time_to) {
      break;
    }
  }
};

exports.addAvailability = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const _availability = { ...req.body, user_id: req.user.id };

    //creating availability
    const availability = await Availability.create(_availability);

    //creating slots
    createSlots(availability.id, req.user.id);

    return res.status(200).json({
      msg: "Availability created successfully",
      data: availability,
    });
  } catch (err) {
    return res.status(400).json({ errors: { error: "Something went wrong!" } });
  }
};

exports.getAvailability = async (req, res, next) => {
  //for only user_id filter
  let availabilities = await Availability.findAll({
    where: { user_id: req.query.id },
    include: [
      {
        model: Slot,
        attributes: ["start", "end"],
      },
    ],
  });

  //for date and user_id filter
  if (req.query.date) {
    availabilities = await Availability.findAll({
      where: {user_id: req.query.id, date: { [Op.lt]: moment(req.query.date, "YYYY-MM-DD") } },
      include: [
        {
          model: Slot,
          attributes: ["start", "end"],
        },
      ],
    });
  }

  return res.status(200).json({
    msg: "Availabilities found succcessfully",
    data: availabilities,
  });
};
