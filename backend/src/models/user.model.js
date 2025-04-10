import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  dob: Date,
  gender: String,
  phoneNumbers: [String],
  address: String,
  profilePicture: String,
});

const User = mongoose.model("User", userSchema);

export default User;
