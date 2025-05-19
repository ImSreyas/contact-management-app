import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    firstName: String,
    lastName: String,
    address: String,
    location: String,
    company: String,
    phoneNumbers: [String],
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
