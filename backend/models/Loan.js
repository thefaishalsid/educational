const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("loans");

async function createLoan(data) {
  return await collection().insertOne({
    ...data,
    status: data.status || "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function getLoanById(id) {
  if (!ObjectId.isValid(id)) return null;

  return await collection().findOne({
    _id: new ObjectId(id),
  });
}

async function getLoansByUser(userId) {
  return await collection()
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

async function getAllLoans() {
  return await collection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
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
    "status",
  ];

  const safeUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  }

  safeUpdates.updatedAt = new Date();

  return await collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: safeUpdates }
  );
}

async function deleteLoan(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid loan ID");
  }

  return await collection().deleteOne({
    _id: new ObjectId(id),
  });
}

module.exports = {
  createLoan,
  getLoanById,
  getLoansByUser,
  getAllLoans,
  updateLoan,
  deleteLoan,
};