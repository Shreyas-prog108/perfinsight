import OpenAI from "openai";
import { validationResult } from "express-validator";
import { Employee } from "../models/Employee.model.js";

const client = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
  });

export async function recommend(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { employeeIds } = req.body;
    let list;
    if (Array.isArray(employeeIds) && employeeIds.length > 0) {
      list = await Employee.find({ _id: { $in: employeeIds } }).lean();
    } else {
      list = await Employee.find().sort({ performanceScore: -1 }).lean();
    }

    if (!list.length) {
      return res.status(400).json({ message: "No employees to analyze" });
    }

    const summary = list.map((e) => ({
      id: String(e._id),
      name: e.name,
      email: e.email,
      department: e.department,
      skills: e.skills,
      performanceScore: e.performanceScore,
      experienceYears: e.experience,
    }));

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        markdown: buildHeuristicRecommendation(summary),
        analyzedCount: summary.length,
        fallback: true,
        hint: "Set OPENAI_API_KEY on the server to use GPT recommendations.",
      });
    }

    const sys = `You are an HR analytics assistant for performance reviews.
Given employee JSON records, respond with Markdown containing these sections clearly labeled:
## Employee ranking
Rank ALL provided employees best-to-worst with a one-line rationale each (use performance score but also experience and breadth of skills).

## Promotion recommendations  
Who should be considered for promotion and why.

## Training & skill enhancement
Concrete training suggestions including for low performers and any obvious skill gaps.

## Individual feedback summaries
Brief bullet feedback per employee (professional tone).

Prefer actionable, concise output.`;

    const userMsg = JSON.stringify(summary, null, 2);

    const completion = await client().chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-nano",
      temperature: 0.4,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userMsg },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    res.json({ markdown: text, analyzedCount: summary.length });
  } catch (e) {
    next(e);
  }
}

function buildHeuristicRecommendation(summary) {
  const sorted = [...summary].sort((a, b) => b.performanceScore - a.performanceScore);
  const ranks = sorted
    .map((e, i) => `${i + 1}. ${e.name} (${e.performanceScore}) — ${e.department}`)
    .join("\n");
  const promote = sorted.filter((e) => e.performanceScore >= 80).map((e) => e.name);
  const train = sorted.filter((e) => e.performanceScore < 60).map((e) => e.name);
  return [
    "## Employee ranking",
    ranks,
    "",
    "## Promotion recommendations",
    promote.length ? promote.join(", ") : "None meet the 80+ heuristic threshold.",
    "",
    "## Training & skill enhancement",
    train.length
      ? `${train.join(", ")}: focus on core role skills and performance coaching.`
      : "Maintain upskilling for all.",
    "",
    "## Individual feedback summaries",
    ...summary.map(
      (e) =>
        `- **${e.name}**: Score ${e.performanceScore}/100.${
          e.performanceScore >= 85
            ? " Strong candidate for stretch goals."
            : e.performanceScore < 60
              ? " Needs structured improvement plan."
              : " Steady performer."
        }`
    ),
  ].join("\n");
}
