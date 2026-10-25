const express = require("express");
const Assignment = require("../models/Assignment");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const assessmentData = req.body;

    console.log("Assessment received");

    const prompt = `
You are an expert career guidance counselor.

Analyze the following student's assessment information and recommend the best career options.

Student Profile:
Name: ${assessmentData.name || "Not provided"}
Age: ${assessmentData.age || "Not provided"}
Location: ${assessmentData.location || "Not provided"}
Qualification: ${assessmentData.qualification || "Not provided"}
Stream: ${assessmentData.stream || "Not provided"}
Marks: ${assessmentData.marks || "Not provided"}
Passing Year: ${assessmentData.passingYear || "Not provided"}
Interests: ${(assessmentData.interests || []).join(", ") || "Not provided"}
Skills: ${assessmentData.skills || "Not provided"}
Budget: ${assessmentData.budget || "Not provided"}
Goal: ${assessmentData.goal || "Not provided"}
Career Goal: ${assessmentData.careerGoal || "Not provided"}

Recommend exactly 3 suitable careers.

Return ONLY valid JSON in this format:

{
  "recommendations": [
    {
      "career": "Career name",
      "match": 90,
      "reason": "Short explanation why this career suits the student",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "courses": ["Course 1", "Course 2"]
    }
  ]
}

Do not include markdown.
Do not include any text outside the JSON.
`;

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
      // temperature: 0.4,
    });

    const aiResponse = response.output_text;

    console.log("AI Response:", aiResponse);

    // Remove possible markdown code fences
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedAI = JSON.parse(cleanedResponse);

    const recommendations = parsedAI.recommendations;

    if (!Array.isArray(recommendations)) {
      throw new Error("Invalid AI recommendations format");
    }

    // Save assessment using the Assignment model
    const result = await Assignment.createAssessment({
      ...assessmentData,
      recommendations,
    });

    console.log("Assessment saved:", result.insertedId);

    res.json({
      success: true,
      message: "Assessment analyzed successfully",
      id: result.insertedId,
      recommendations,
    });

  } catch (error) {
    console.error("AI Assessment Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to analyze assessment",
    });
  }
});

module.exports = router;