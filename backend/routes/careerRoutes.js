const express = require("express");
const Career = require("../models/Career");

const router = express.Router();


// ========================================
// GET ALL CAREERS
// GET /api/admin/careers
// ========================================

router.get("/", async (req, res) => {
  try {
    const careers = await Career.getAllCareers();

    return res.status(200).json({
      success: true,
      careers,
    });
  } catch (error) {
    console.error("Get careers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load careers",
    });
  }
});


// ========================================
// GET SINGLE CAREER BY ID OR SLUG
// GET /api/admin/careers/:id
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let career = await Career.getCareerById(id);

    // ID se career nahi mila to slug se search karo
    if (!career) {
      career = await Career.getCareerBySlug(id);
    }

    if (!career) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    return res.status(200).json({
      success: true,
      career,
    });
  } catch (error) {
    console.error("Get career error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load career",
    });
  }
});


// ========================================
// ADD NEW CAREER
// POST /api/admin/careers
// ========================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      icon,
      description,
      education,
      skills,
      courses,
      roadmap,
      salary,
      jobRoles,
    } = req.body;

    // Required fields validation
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof slug !== "string" ||
      !slug.trim() ||
      typeof category !== "string" ||
      !category.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and category are required",
      });
    }

    const cleanSlug = slug.trim().toLowerCase();

    // Duplicate slug check
    const existing = await Career.getCareerBySlug(cleanSlug);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Career with this slug already exists",
      });
    }

    const career = {
      title: title.trim(),
      slug: cleanSlug,
      category: category.trim(),
      icon: icon || "🎯",
      description: description || "",
      education: education || "",
      skills: Array.isArray(skills) ? skills : [],
      courses: Array.isArray(courses) ? courses : [],
      roadmap: Array.isArray(roadmap) ? roadmap : [],
      salary: salary || "",
      jobRoles: Array.isArray(jobRoles) ? jobRoles : [],
    };

    const result = await Career.createCareer(career);

    // Model se generated timestamps aur ID response mein bhejo
    return res.status(201).json({
      success: true,
      message: "Career added successfully",
      career: {
        ...career,
        _id: result.insertedId,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    console.error("Add career error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add career",
    });
  }
});


// ========================================
// UPDATE CAREER
// PUT /api/admin/careers/:id
// ========================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      category,
      icon,
      description,
      education,
      skills,
      courses,
      roadmap,
      salary,
      jobRoles,
    } = req.body;

    // Sirf request mein bheje gaye fields update honge
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
      }
      updates.title = title.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== "string" || !slug.trim()) {
        return res.status(400).json({
          success: false,
          message: "Slug must be a non-empty string",
        });
      }

      const cleanSlug = slug.trim().toLowerCase();
      const existing = await Career.getCareerBySlug(cleanSlug);

      if (existing && existing._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Career with this slug already exists",
        });
      }

      updates.slug = cleanSlug;
    }

    if (category !== undefined) {
      if (typeof category !== "string" || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category must be a non-empty string",
        });
      }
      updates.category = category.trim();
    }

    if (icon !== undefined) updates.icon = icon;
    if (description !== undefined) updates.description = description;
    if (education !== undefined) updates.education = education;
    if (skills !== undefined) updates.skills = skills;
    if (courses !== undefined) updates.courses = courses;
    if (roadmap !== undefined) updates.roadmap = roadmap;
    if (salary !== undefined) updates.salary = salary;
    if (jobRoles !== undefined) updates.jobRoles = jobRoles;

    // Empty update request reject karo
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No career fields provided for update",
      });
    }

    const result = await Career.updateCareer(id, updates);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career updated successfully",
    });
  } catch (error) {
    console.error("Update career error:", error);

    if (error.message === "Invalid career ID") {
      return res.status(400).json({
        success: false,
        message: "Invalid career ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update career",
    });
  }
});


// ========================================
// DELETE CAREER
// DELETE /api/admin/careers/:id
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Career.deleteCareer(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Career not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Career deleted successfully",
    });
  } catch (error) {
    console.error("Delete career error:", error);

    if (error.message === "Invalid career ID") {
      return res.status(400).json({
        success: false,
        message: "Invalid career ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete career",
    });
  }
});

module.exports = router;