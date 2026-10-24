const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// =====================================================
// LOAN ENQUIRY MODEL
// Uses the existing "loanEnquiries" collection
// =====================================================

async function createLoanEnquiry(enquiryData) {
  const db = getDB();

  const enquiry = {
    name: enquiryData.name,
    email: enquiryData.email,
    phone: enquiryData.phone,
    enquiryType: "Education Loan",
    message: enquiryData.message,
    createdAt: new Date()
  };

  return await db.collection("loanEnquiries").insertOne(enquiry);
}

async function getAllLoanEnquiries() {
  const db = getDB();

  return await db
    .collection("loanEnquiries")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function deleteLoanEnquiry(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid enquiry ID");
  }

  const db = getDB();

  return await db
    .collection("loanEnquiries")
    .deleteOne({ _id: new ObjectId(id) });
}

// =====================================================
// EXISTING LOAN APPLICATION MODEL
// Keeps the separate "loans" collection methods
// =====================================================

async function createLoan(loanData) {
  const db = getDB();

  const loan = {
    ...loanData,
    status: loanData.status || "pending",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return await db.collection("loans").insertOne(loan);
}

async function getLoanById(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = getDB();

  return await db
    .collection("loans")
    .findOne({ _id: new ObjectId(id) });
}

async function getLoansByUser(userId) {
  const db = getDB();

  return await db.collection("loans").find({ userId }).toArray();
}

async function getAllLoans() {
  const db = getDB();

  return await db.collection("loans").find({}).toArray();
}

async function updateLoan(id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid loan ID");
  }

  const allowedFields = [
    "amount",
    "purpose",
    "applicantDetails",
    "documents",
    "status"
  ];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  }

  if (Object.keys(safeUpdates).length === 0) {
    return { matchedCount: 0, modifiedCount: 0 };
  }

  safeUpdates.updatedAt = new Date();

  const db = getDB();

  return await db.collection("loans").updateOne(
    { _id: new ObjectId(id) },
    { $set: safeUpdates }
  );
}

async function deleteLoan(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid loan ID");
  }

  const db = getDB();

  return await db
    .collection("loans")
    .deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
  createLoanEnquiry,
  getAllLoanEnquiries,
  deleteLoanEnquiry,
  createLoan,
  getLoanById,
  getLoansByUser,
  getAllLoans,
  updateLoan,
  deleteLoan
};