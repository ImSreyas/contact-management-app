import Contact from "../models/contact.model.js";
import {
  updateContact,
  deleteContact,
  createContact,
} from "../services/contact.service.js";
import { sendSuccess, sendError } from "../utils.js";

export const create = async (req, res) => {
  try {
    const { contact, error } = await createContact(req.user.id, req.body);
    if (error) {
      return sendError(res, error, error.message, error.status || 400);
    }
    return sendSuccess(res, { contact }, "Contact created successfully", 201);
  } catch (err) {
    return sendError(
      res,
      { code: "500", error: err.message || "Internal server error" },
      "Failed to create contact",
      500
    );
  }
};

export const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      search = "",
      search_by = "name",
      sort = "createdAt",
      page = 1,
      page_size = 10,
    } = req.query;

    // Parse pagination params
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(page_size, 10) || 10;

    // Build search filter
    let filter = { userId };
    if (search) {
      switch (search_by) {
        case "phoneNumbers":
          filter.phoneNumbers = {
            $elemMatch: { $regex: search, $options: "i" },
          };
          break;
        case "company":
          filter.company = { $regex: search, $options: "i" };
          break;
        case "location":
          filter.location = { $regex: search, $options: "i" };
          break;
        case "name":
        default:
          // Search by full name (firstName + " " + lastName)
          filter.$expr = {
            $regexMatch: {
              input: { $concat: ["$firstName", " ", "$lastName"] },
              regex: search,
              options: "i",
            },
          };
          break;
      }
    }

    // Build sort option
    let sortOption = {};
    if (sort === "alphabetical" || sort === "name") {
      sortOption = { firstName: 1, lastName: 1 };
    } else if (sort === "location") {
      sortOption = { location: 1 };
    } else if (sort === "createdAt") {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    // Get total count for pagination
    const totalRecords = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / pageSize);

    if (pageNum > totalPages && totalPages !== 0) {
      return sendError(
        res,
        { message: "Page not found" },
        "Page not found",
        404
      );
    }

    // Query contacts with pagination
    const contacts = await Contact.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    return sendSuccess(
      res,
      {
        records: contacts,
        totalRecords,
        page: pageNum,
        pageSize,
        totalPages,
      },
      "Contacts fetched successfully",
      200
    );
  } catch (err) {
    return sendError(res, err, "Failed to fetch contacts", 500);
  }
};

export const update = async (req, res) => {
  const contact = await updateContact(req.params.id, req.body);
  if (!contact) {
    return res
      .status(400)
      .json({ status: false, data: "No Contact found with the provided id" });
  }
  res.json({ status: true, data: contact });
};

export const remove = async (req, res) => {
  const response = await deleteContact(req.params.id);
  if (!response) {
    return res
      .status(404)
      .json({ status: false, message: "Contact not found" });
  }
  res.status(200).json({ status: true, message: "Contact deleted" });
};
