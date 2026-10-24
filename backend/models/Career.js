const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const collection = () => getDB().collection("careers");


// ========================================
// CREATE CAREER
// ========================================

async function createCareer(data) {
  const now = new Date();

  const career = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection().insertOne(career);

  // Insert result ke saath saved timestamps bhi return karo
  return {
    ...result,
    createdAt: now,
    updatedAt: now,
  };
}


// ========================================
// GET CAREER BY ID
// ========================================

async function getCareerById(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return await collection().findOne({
    _id: new ObjectId(id),
  });
}


// ========================================
// GET CAREER BY SLUG
// ========================================

async function getCareerBySlug(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    return null;
  }

  return await collection().findOne({
    slug: slug.trim().toLowerCase(),
  });
}


// ========================================
// GET ALL CAREERS
// ========================================

async function getAllCareers() {
  return await collection()
    .find({})
    .sort({ title: 1 })
    .toArray();
}


// ========================================
// GET CAREERS BY USER
// ========================================

async function getCareersByUser(userId) {
  return await collection()
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}


// ========================================
// UPDATE CAREER
// ========================================

async function updateCareer(id, updates) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid career ID");
  }

  const allowedFields = [
    // Career catalogue fields
    "title",
    "slug",
    "category",
    "icon",
    "description",
    "education",
    "skills",
    "courses",
    "roadmap",
    "salary",
    "jobRoles",

    // Existing career analysis fields
    "interests",
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

  // Empty update ko reject karo
  if (Object.keys(safeUpdates).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  safeUpdates.updatedAt = new Date();

  return await collection().updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: safeUpdates,
    }
  );
}


// ========================================
// DELETE CAREER
// ========================================

async function deleteCareer(id) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid career ID");
  }

  return await collection().deleteOne({
    _id: new ObjectId(id),
  });
}


// ========================================
// EXPORT FUNCTIONS
// ========================================

module.exports = {
  createCareer,
  getCareerById,
  getCareerBySlug,
  getCareersByUser,
  getAllCareers,
  updateCareer,
  deleteCareer,
};