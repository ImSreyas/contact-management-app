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
  res.json({ status: true, data: contact });
};

export const remove = async (req, res) => {
  await deleteContact(req.params.id);
  res.status(204).send();
};
