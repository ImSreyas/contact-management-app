import Contact from "../models/contact.model.js";

export const createContact = (userId, data) =>
  Contact.create({ ...data, userId });

export const getContacts = (userId) => Contact.find({ userId });

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
