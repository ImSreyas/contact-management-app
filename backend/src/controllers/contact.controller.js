import {
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} from "../services/contact.service.js";

export const create = async (req, res) => {
  const contact = await createContact(req.user.id, req.body);
  res.status(201).json({ status: true, data: contact });
};

export const getAll = async (req, res) => {
  const contacts = await getContacts(req.user.id);
  res.json({ status: true, data: contacts });
};

export const update = async (req, res) => {
  const contact = await updateContact(req.params.id, req.body);
  if (!contact) {
  res.status(400).json({ status: false, data: "No Contact found with the provided id" });
  }
  res.json({ status: true, data: contact });
};

export const remove = async (req, res) => {
  const response = await deleteContact(req.params.id);
  if (!response) {
    return res.status(404).json({ status: false, message: "Contact not found" });
  }
  res.status(200).json({ status: true, message: "Contact deleted" });
};
