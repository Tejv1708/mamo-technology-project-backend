import timeSlot from "../models/Timeslots.js";
import User from "../models/User.js";

export const createSlot = async (req, res, next) => {
  try {
    const { title, description, startTimeDate, endTimeDate } = req.body;

    console.log(title, description, startTimeDate, endTimeDate);
    const newSlot = new timeSlot({
      title,
      description,
      startTimeDate,
      endTimeDate,
      author: req.params.id,
    });

    const parsedStartTimeDate = new Date(startTimeDate);
    const parsedEndTimeDate = new Date(endTimeDate);

    console.log(new Date() - parsedStartTimeDate);

    // Validate that endTime is after startTime
    if (parsedEndTimeDate <= parsedStartTimeDate) {
      return res.status(400).send("End Time should be greater than Start Time");
    }

    const overlappingSlot = await timeSlot.findOne({
      $or: [
        {
          startTimeDate: { $lt: parsedEndTimeDate, $gte: parsedStartTimeDate },
        },
        { endTimeDate: { $gt: parsedStartTimeDate, $lte: parsedEndTimeDate } },
        {
          startTimeDate: { $lte: parsedStartTimeDate },
          endTimeDate: { $gte: parsedEndTimeDate },
        },
      ],
    });

    if (overlappingSlot) {
      return res.status(400).send("Time slot conflicts with an existing one");
    }

    const popUser = await timeSlot.findById(newSlot._id).populate("author");
    console.log(popUser);
    await newSlot.save();

    return res.status(201).json(newSlot);
  } catch (err) {
    console.log("Error from TimeSlot ", err);
  }
};

export const getAllMeeting = async (req, res, next) => {
  try {
    const allMeeting = await timeSlot.find();
    return res.status(200).json(allMeeting);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateMeeting = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, startTime, endTime } = req.body;

  try {
    const updatedMeeting = await timeSlot.findByIdAndUpdate(
      id,
      { title, description, startTime, endTime },
      { new: true, runValidators: true }
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json(updatedMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating meeting", error });
  }
};

export const deleteMeeting = async (req, res, next) => {
  try {
    const deleteMeeting = await timeSlot.findByIdAndDelete(req.params.id);
    return res.status(204).json("Meeting is succesfully deleted ");
  } catch (err) {
    return res.status(500).json(err);
  }
};
