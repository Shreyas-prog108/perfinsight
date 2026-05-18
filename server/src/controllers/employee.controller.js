import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { Employee } from "../models/Employee.model.js";

export async function createEmployee(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { password, name, email, department, performanceScore, experience } = req.body;
    const skills = req.body.skills ?? [];

    const docData = {
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
      createdBy: req.user?.userId,
    };

    const pw = typeof password === "string" ? password.trim() : "";
    if (pw.length > 0) {
      docData.passwordHash = await bcrypt.hash(pw, 10);
    }

    const doc = await Employee.create(docData);
    res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Duplicate email" });
    }
    next(e);
  }
}

export async function listEmployees(req, res, next) {
  try {
    const sort = req.query.sort === "score_desc" ? { performanceScore: -1 } : { createdAt: -1 };
    const employees = await Employee.find().sort(sort).lean();
    res.json(employees);
  } catch (e) {
    next(e);
  }
}

export async function searchEmployees(req, res, next) {
  try {
    const { department, minScore, skill } = req.query;
    const filter = {};
    if (department) filter.department = new RegExp(`^${escapeRegex(String(department))}$`, "i");
    if (minScore !== undefined && minScore !== "") {
      const n = Number(minScore);
      if (!Number.isNaN(n)) filter.performanceScore = { $gte: n };
    }
    if (skill) {
      filter.skills = new RegExp(escapeRegex(String(skill)), "i");
    }
    const employees = await Employee.find(filter).sort({ performanceScore: -1 }).lean();
    res.json(employees);
  } catch (e) {
    next(e);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const e = await Employee.findById(req.params.id);
    if (!e) return res.status(404).json({ message: "Employee not found" });
    res.json(e);
  } catch (e) {
    next(e);
  }
}

export async function updatePerformance(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { performanceScore } = req.body;
    const e = await Employee.findByIdAndUpdate(
      req.params.id,
      { performanceScore },
      { new: true, runValidators: true }
    );
    if (!e) return res.status(404).json({ message: "Employee not found" });
    res.json(e);
  } catch (e) {
    next(e);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const e = await Employee.findByIdAndDelete(req.params.id);
    if (!e) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee removed successfully", id: e._id });
  } catch (e) {
    next(e);
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
