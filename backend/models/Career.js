const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("careers");

async function createCareer(data) {
  return await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function getCareerById(id) {
  if (!ObjectId.isValid(id)) return null;

  return await collection().findOne({
    _id: new ObjectId(id),
  });
}

async function getCareersByUser(userId) {
  return await collection()
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

async function getAllCareers() {
  return await collection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function updateCareer(id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid career ID");
  }

  const allowedFields = [
    "interests",
    "skills",
    "education",
    "recommendations",
    "analysis",
    "preferredCareer",
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

async function deleteCareer(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid career ID");
  }

  return await collection().deleteOne({
    _id: new ObjectId(id),
  });
}

module.exports = {
  createCareer,
  getCareerById,
  getCareersByUser,
  getAllCareers,
  updateCareer,
  deleteCareer,
};