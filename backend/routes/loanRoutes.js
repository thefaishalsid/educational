const express = require("express");
const Loan = require("../models/Loan");

const router = express.Router();

// =====================================================
// SUBMIT EDUCATION LOAN ENQUIRY
// POST /enquiry
// =====================================================

router.post("/enquiry", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof phone !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const enquiryData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim()
    };

    const result = await Loan.createLoanEnquiry(enquiryData);

    return res.status(201).json({
      success: true,
      message: "Education loan enquiry submitted successfully",
      enquiry: {
        _id: result.insertedId,
        ...enquiryData,
        enquiryType: "Education Loan",
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error("Loan enquiry error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry"
    });
  }
});

// =====================================================
// GET ALL LOAN ENQUIRIES
// GET /enquiries
// =====================================================

router.get("/enquiries", async (req, res) => {
  try {
    const enquiries = await Loan.getAllLoanEnquiries();

    return res.json({
      success: true,
      enquiries
    });
  } catch (error) {
    console.error("Loan enquiries fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load loan students"
    });
  }
});

// =====================================================
// DELETE LOAN ENQUIRY
// DELETE /enquiries/:id
// =====================================================

router.delete("/enquiries/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Loan.deleteLoanEnquiry(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Loan enquiry not found"
      });
    }

    return res.json({
      success: true,
      message: "Loan enquiry deleted successfully"
    });
  } catch (error) {
    if (error.message === "Invalid enquiry ID") {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID"
      });
    }

    console.error("Loan enquiry delete error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete enquiry"
    });
  }
});

module.exports = router;