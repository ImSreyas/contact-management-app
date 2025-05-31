import Contact from "../models/contact.model.js";
import { contactSchema } from "../schema/formSchema.js";
import { AppError } from "../utils.js";

export const getContacts = (userId) => Contact.find({ userId });

export const getContact = async (userId, id) => {
  const contact = await Contact.findOne({ userId, _id: id });
  if (contact) {
    return {
      contact,
      message: "Contact found",
    };
  } else {
    throw new AppError({ code: "201", error: "Contact not found" });
  }
};

export const updateContact = async (userId, id, data) => {
  // Validate input
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return {
      error: {
        code: "400",
        error: result.error.errors,
        message: "Validation failed",
        status: 400,
      },
    };
  }

  const { firstName, lastName, phoneNumbers } = data;

  // Check for duplicate phone numbers in the same contact
  const uniqueNumbers = new Set(phoneNumbers.map((num) => num.trim()));
  if (uniqueNumbers.size !== phoneNumbers.length) {
    return {
      error: {
        code: "409",
        error: "Duplicate phone numbers in the same contact",
        message: "Duplicate phone numbers in the same contact",
        status: 409,
      },
    };
  }

  // Check for duplicate name (case-insensitive, trimmed), excluding this contact
  const nameString = `${firstName} ${lastName}`.trim();
  const nameConflict = await Contact.findOne({
    userId,
    _id: { $ne: id },
    $expr: {
      $regexMatch: {
        input: {
          $trim: { input: { $concat: ["$firstName", " ", "$lastName"] } },
        },
        regex: nameString,
        options: "i",
      },
    },
  });

  if (nameConflict) {
    return {
      error: {
        code: "410",
        error: "A contact with this name already exists",
        message: "Duplicate contact name",
        status: 409,
      },
    };
  }

  // Check if any phone number exists in any other contact (excluding this contact)
  const numberConflict = await Contact.findOne({
    userId,
    _id: { $ne: id },
    phoneNumbers: { $in: phoneNumbers },
  });

  if (numberConflict) {
    return {
      error: {
        code: "411",
        error: "One or more phone numbers already exist in another contact",
        message: "Phone number already exists in another contact",
        status: 409,
      },
    };
  }

  // All checks passed, update contact
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    { $set: { ...data } },
    { new: true },
  );

  if (!updatedContact) {
    return {
      error: {
        code: "404",
        error: "Contact not found",
        message: "Contact not found",
        status: 404,
      },
    };
  }

  return { contact: updatedContact };
};

export const toggleFav = async (userId, id, isFav) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    { $set: { isFavorite: isFav } },
    { new: true },
  );
  if (updatedContact) {
    return {
      contact: {
        name: `${updatedContact.firstName} ${updatedContact.lastName}`,
        id: updatedContact._id,
        isFavorite: updatedContact.isFavorite,
      },
      message: "Updated Favorite successfully",
    };
  } else {
    throw new AppError({ code: "101", error: "Contact not found" });
  }
};

export const deleteContact = async (userId, id) => {
  const deletedContact = await Contact.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    {
      $set: { isDeleted: true },
    },
    { new: true },
  );
  if (deletedContact) {
    return {
      contact: {
        name: `${deletedContact.firstName} ${deletedContact.lastName}`,
        id: deletedContact._id,
      },
      message: "Contact deleted successfully",
    };
  } else {
    throw new AppError({ code: "101", error: "Contact not found" });
  }
};

export const createContact = async (userId, data) => {
  // Validate input
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return {
      error: {
        code: "400",
        error: result.error.errors,
        message: "Validation failed",
        status: 400,
      },
    };
  }

  const { firstName, lastName, phoneNumbers } = data;

  // Check for duplicate phone numbers in the same contact
  const uniqueNumbers = new Set(phoneNumbers.map((num) => num.trim()));
  if (uniqueNumbers.size !== phoneNumbers.length) {
    return {
      error: {
        code: "409",
        error: "Duplicate phone numbers in the same contact",
        message: "Duplicate phone numbers in the same contact",
        status: 409,
      },
    };
  }

  // Check for duplicate name (case-insensitive, trimmed)
  const nameString = `${firstName} ${lastName}`.trim();
  const nameConflict = await Contact.findOne({
    $expr: {
      $regexMatch: {
        input: {
          $trim: { input: { $concat: ["$firstName", " ", "$lastName"] } },
        },
        regex: nameString,
        options: "i",
      },
    },
  });

  if (nameConflict) {
    return {
      error: {
        code: "410",
        error: "A contact with this name already exists",
        message: "Duplicate contact name",
        status: 409,
      },
    };
  }

  // Check if any phone number exists in any contact
  const numberConflict = await Contact.findOne({
    phoneNumbers: { $in: phoneNumbers },
  });

  if (numberConflict) {
    return {
      error: {
        code: "411",
        error: "One or more phone numbers already exist in another contact",
        message: "Phone number already exists in another contact",
        status: 409,
      },
    };
  }

  // All checks passed, create contact
  const contact = await Contact.create({ ...data, userId });
  return { contact };
};
