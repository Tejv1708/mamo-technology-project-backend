import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (err) {
    console.log("Error from UserSchema", err);
  }
  next();
});

const User = mongoose.model("Users", userSchema);

export default User;
