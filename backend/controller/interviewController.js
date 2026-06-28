import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../service/openRouter.js";
import User from "../models/userModels.js";
import Interview from "../models/interviewModels.js";

export async function analyze(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const filePath = req.file.path;

    const fileBuffer = await fs.promises.readFile(filePath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({
      data: uint8Array,
    }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .join(" ");

      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `
Extract structured information from the resume.

Return ONLY valid JSON.

{
  "role":"",
  "experience":"",
  "projects":[],
  "skills":[]
}
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);

    const cleanResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleanResponse);

    await fs.promises.unlink(filePath);

    return res.status(200).json({
      success: true,
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




export async function generateQuestion(req, res) {
  try {
    const {
      role,
      experience,
      mode,
      resumeText,
      projects,
      skills,
    } = req.body;

    const userRole = role?.trim();
    const userExperience = experience?.trim();
    const interviewMode = mode?.trim();
    const safeResume = resumeText?.trim() || "None";

    if (!userRole || !userExperience || !interviewMode) {
      return res.status(400).json({
        success: false,
        message: "Role, Experience and Interview Mode are required.",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length > 0
        ? projects.join(", ")
        : "None";

    const skillsText =
      Array.isArray(skills) && skills.length > 0
        ? skills.join(", ")
        : "None";

    const userPrompt = `
Role: ${userRole}
Experience: ${userExperience}
Interview Mode: ${interviewMode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
`;

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer.

Generate exactly FIVE interview questions.

Rules:
- Return only questions.
- No numbering.
- No bullet points.
- One question per line.
- Each question must contain 15 to 25 words.
- Every question must end with a question mark.
- Use simple conversational English.
- No explanations.

Difficulty:
Question 1 -> Easy
Question 2 -> Easy
Question 3 -> Medium
Question 4 -> Medium
Question 5 -> Hard

Use the candidate's:
- Role
- Experience
- Interview Mode
- Projects
- Skills
- Resume

If projects exist, ask at least TWO project-based questions.
If skills exist, ask at least ONE skill-based question.
`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions.",
      });
    }

    const questions = aiResponse
      .split("\n")
      .map((q) =>
        q
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-*]\s*/, "")
          .trim()
      )
      .filter((q) => q.length > 0)
      .slice(0, 5);

    if (questions.length < 5) {
      return res.status(500).json({
        success: false,
        message: "AI did not generate enough questions.",
      });
    }

    const difficultyLevels = [
      "easy",
      "easy",
      "medium",
      "medium",
      "hard",
    ];

    const timeLimits = [60, 60, 90, 90, 120];

    const interview = await Interview.create({
      userId: user._id,
      role: userRole,
      experience: userExperience,
      mode: interviewMode,
      resumeText: safeResume,
      projects: Array.isArray(projects) ? projects : [],
      skills: Array.isArray(skills) ? skills : [],
      questions: questions.map((question, index) => ({
        question,
        difficulty: difficultyLevels[index],
        timeLimit: timeLimits[index],
        answer: "",
        score: 0,
        feedback: "",
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Interview questions generated successfully.",
      interviewId: interview._id,
      questions: interview.questions,
      userName:user.name
    });
  } catch (error) {
    console.error("Generate Question Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}




export async function submitAnswer(req, res) {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Empty Answer
    if (!answer || answer.trim() === "") {
      question.answer = "";
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "You did not submit an answer.";

      await interview.save();

      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    // Time Limit
    if (Number(timeTaken) > Number(question.timeLimit)) {
      question.answer = "";
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback =
        "Time limit exceeded. Answer was not evaluated.";

      await interview.save();

      return res.status(200).json({
        success: true,
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are an expert technical interviewer.

Evaluate the candidate's answer.

Return ONLY valid JSON.

{
  "confidence": 85,
  "communication": 90,
  "correctness": 88,
  "finalScore": 87,
  "feedback":"Give short constructive feedback in 2-3 lines."
}

Rules:
- confidence must be between 0 and 100
- communication must be between 0 and 100
- correctness must be between 0 and 100
- finalScore must be between 0 and 100
- Return ONLY JSON
`,
      },
      {
        role: "user",
        content: `
Question:
${question.question}

Candidate Answer:
${answer}
`,
      },
    ];

    const aiResponse = await askAi(messages);

    let parsed;

    try {
      const clean = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(clean);
    } catch (err) {
      parsed = {
        confidence: 50,
        communication: 50,
        correctness: 50,
        finalScore: 50,
        feedback: "Unable to evaluate answer.",
      };
    }

    const safeNumber = (value) => {
      const num = Number(value);

      if (isNaN(num)) return 0;

      return Math.max(0, Math.min(100, num));
    };

    question.answer = answer.trim();

    question.confidence = safeNumber(parsed.confidence);
    question.communication = safeNumber(parsed.communication);
    question.correctness = safeNumber(parsed.correctness);
    question.score = safeNumber(parsed.finalScore);

    question.feedback =
      typeof parsed.feedback === "string"
        ? parsed.feedback
        : "No feedback generated.";

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Answer evaluated successfully.",
      data: {
        confidence: question.confidence,
        communication: question.communication,
        correctness: question.correctness,
        score: question.score,
        feedback: question.feedback,
      },
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
export async function finishInterview(req, res) {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required.",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += Number(q.score || 0);
      totalConfidence += Number(q.confidence || 0);
      totalCommunication += Number(q.communication || 0);
      totalCorrectness += Number(q.correctness || 0);
    });

    const finalScore =
      totalQuestions > 0
        ? Number((totalScore / totalQuestions).toFixed(2))
        : 0;

    const avgConfidence =
      totalQuestions > 0
        ? Number((totalConfidence / totalQuestions).toFixed(2))
        : 0;

    const avgCommunication =
      totalQuestions > 0
        ? Number((totalCommunication / totalQuestions).toFixed(2))
        : 0;

    const avgCorrectness =
      totalQuestions > 0
        ? Number((totalCorrectness / totalQuestions).toFixed(2))
        : 0;

    interview.finalScore = finalScore;

    // Ye fields model me honi chahiye
    interview.avgConfidence = avgConfidence;
    interview.avgCommunication = avgCommunication;
    interview.avgCorrectness = avgCorrectness;

    // Schema enum ke hisaab se
    interview.status = "Complete";

    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Interview completed successfully.",
      result: {
        interviewId: interview._id,
        totalQuestions,
        finalScore,
        avgConfidence,
        avgCommunication,
        avgCorrectness,
        status: interview.status,
      },
    });
  } catch (error) {
    console.error("Finish Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}