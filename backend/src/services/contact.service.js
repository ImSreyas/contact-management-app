import Contact from "../models/contact.model.js";
import { contactSchema } from "../schema/formSchema.js";

export const getContacts = (userId) => Contact.find({ userId });

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);

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
