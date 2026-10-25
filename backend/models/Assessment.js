const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("assessments");

async function createAssessment(data) {
  const now = new Date();

  return await collection().insertOne({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

async function getAssessmentById(id) {
  if (!ObjectId.isValid(id)) return null;

  return await collection().findOne({
    _id: new ObjectId(id),
  });
}

async function getAssessmentsByUser(userId) {
  return await collection()
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

async function getAllAssessments() {
  return await collection()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

async function updateAssessment(id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid assessment ID");
  }

  const allowedFields = [
    "title",
    "answers",
    "marks",
    "totalMarks",
    "status",
    "result",
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

async function deleteAssessment(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid assessment ID");
  }

  return await collection().deleteOne({
    _id: new ObjectId(id),
  });
}

module.exports = {
  createAssessment,
  getAssessmentById,
  getAssessmentsByUser,
  getAllAssessments,
  updateAssessment,
  deleteAssessment,
};