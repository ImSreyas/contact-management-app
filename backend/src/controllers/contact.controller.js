import Contact from "../models/contact.model.js";
import {
  updateContact,
  deleteContact,
  createContact,
  toggleFav,
  getContact,
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
      500,
    );
  }
};

export const getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.query);
    const {
      search = "",
      search_by = "name",
      sort = "createdAt",
      fav = "all",
      page = 1,
      page_size = 10,
    } = req.query;

    // Parse pagination params
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(page_size, 10) || 10;

    // Build search filter
    let filter = { userId, isDeleted: false };

    if (fav === "favorite") {
      filter.isFavorite = true;
    } else if (fav === "not-favorite") {
      filter.isFavorite = false;
    }

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
        404,
      );
    }

    // Query contacts with pagination
    const contacts = await Contact.find(filter)
      .sort(sortOption)
      .collation({ locale: "en", strength: 1 })
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
      200,
    );
  } catch (err) {
    return sendError(res, err, "Failed to fetch contacts", 500);
  }
};

export const getOne = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!userId) {
    return sendError(res, {}, "Unautherized", 401);
  }
  if (!id) {
    return sendError(
      res,
      { code: "129", error: "Id not provided in the URL" },
      "Params missing",
      400,
    );
  }

  try {
    const response = await getContact(userId, id);
    if (response) {
      return sendSuccess(res, { contact: response.contact }, response.message);
    } else {
      return sendError(res, {}, "Something went wrong");
    }
  } catch (error) {
    return sendError(res, error, "Something went wrong");
  }
};

export const update = async (req, res) => {
  try {
    const { contact, error } = await updateContact(
      req.user.id,
      req.params.id,
      req.body,
    );
    if (error) {
      return sendError(res, error, error.message, error.status || 400);
    }
    return sendSuccess(res, { contact }, "Contact updated successfully", 201);
  } catch (err) {
    return sendError(
      res,
      { code: "500", error: err.message || "Internal server error" },
      "Failed to create contact",
      500,
    );
  }
};

export const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { isFavorite } = req.body;

  if (!userId) {
    return sendError(res, {}, "Unautherized", 401);
  }

  if (!id || isFavorite === undefined) {
    return sendError(
      res,
      { code: "194", error: "isFavorite fields is missing" },
      "Fields missing",
      400,
    );
  }

  try {
    const updatedContact = await toggleFav(userId, id, isFavorite);
    return sendSuccess(
      res,
      updatedContact,
      "Successfully updated favorite contact",
    );
  } catch (error) {
    return sendError(res, error, "Something went wrong");
  }
};

export const remove = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!userId) {
    return sendError(res, {}, "Unautherized", 401);
  }

  if (!id) {
    return sendError(
      res,
      { code: "129", error: "Id not provided in the URL" },
      "Params missing",
      400,
    );
  }

  try {
    const deletedContact = await deleteContact(userId, id);
    return sendSuccess(res, deletedContact, "Contact deleted successfully");
  } catch (error) {
    return sendError(res, error, "Failed to delete contact", 400);
  }
};
