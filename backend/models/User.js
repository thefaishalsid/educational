const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("users");

async function createUser(userData) {
  return await collection().insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

async function findUserByEmail(email) {
  return await collection().findOne({
    email: email.trim().toLowerCase(),
  });
}

async function findUserById(id) {
  if (!ObjectId.isValid(id)) return null;

  return await collection().findOne({
    _id: new ObjectId(id),
  });
}

async function getAllUsers() {
  return await collection()
    .find({}, { projection: { password: 0, passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}

async function updateUser(id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  const allowedFields = ["name", "email", "role", "phone"];
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

async function deleteUser(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid user ID");
  }

  return await collection().deleteOne({
    _id: new ObjectId(id),
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};