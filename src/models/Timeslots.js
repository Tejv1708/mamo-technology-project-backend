import mongoose, { mongo } from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },

  startTimeDate: {
    type: Date,
  },
  endTimeDate: {
    type: Date,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Reference ObjectId
    ref: "Users", // Model to reference
  },
});

// timeSlotSchema.pre("save", async function (next) {
//   try {
//     console.log(typeof this.endTime);
//     if (this.endTime - this.startTime < 0) {
//       return next(new Error("End Time Should be Greater then StartTime"));
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   next();
// });

timeSlotSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name",
  });
  next();
});

const timeSlot = mongoose.model("Time", timeSlotSchema);

export default timeSlot;
