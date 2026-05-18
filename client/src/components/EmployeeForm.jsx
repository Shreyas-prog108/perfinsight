import { useState } from "react";
import api from "../services/api.js";

const empty = () => ({
  name: "",
  email: "",
  department: "",
  skillsText: "",
  performanceScore: 70,
  experience: 1,
  password: "",
  passwordConfirm: "",
});

export default function EmployeeForm({ onCreated }) {
  const [values, setValues] = useState(empty);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  function patch(k, v) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    const skills = values.skillsText
      .split(/[,]/g)
      .map((s) => s.trim())
      .filter(Boolean);

    const p1 = values.password.trim();
    const p2 = values.passwordConfirm.trim();
    if (p1 || p2) {
      if (p1.length < 6) {
        setErr("Employee password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      if (p1 !== p2) {
        setErr("Password confirmation does not match.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        name: values.name,
        email: values.email,
        department: values.department,
        skills,
        performanceScore: Number(values.performanceScore),
        experience: Number(values.experience),
      };
      if (p1) payload.password = p1;

      await api.post("/employees", payload);
      setValues(empty());
      setMsg("Employee stored successfully. Share login details with them if you set a portal password.");
      if (onCreated) onCreated();
    } catch (ex) {
      const data = ex.response?.data;
      setErr(data?.message || data?.errors?.[0]?.msg || ex.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Employee registration</h2>
      <p className="muted small employee-form-intro">
        HR / Admin only · optional portal password HR gives to that employee; it is stored as a bcrypt hash in MongoDB (never returned by list/detail APIs afterward).
      </p>
      <form className="form grid-two" onSubmit={submit}>
        <label className="span-2">
          Name
          <input value={values.name} onChange={(e) => patch("name", e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={values.email} onChange={(e) => patch("email", e.target.value)} required />
        </label>
        <label>
          Department
          <input value={values.department} onChange={(e) => patch("department", e.target.value)} required />
        </label>
        <label className="span-2">
          Skills <span className="muted tiny">comma-separated</span>
          <input
            placeholder="React, Node.js, MongoDB"
            value={values.skillsText}
            onChange={(e) => patch("skillsText", e.target.value)}
          />
        </label>
        <label className="span-2">
          Employee portal password <span className="muted tiny">optional · min 6 chars</span>
          <input
            type="password"
            placeholder="Give this verbally or via secure channel to the employee"
            value={values.password}
            autoComplete="new-password"
            onChange={(e) => patch("password", e.target.value)}
          />
        </label>
        <label className="span-2">
          Confirm employee password
          <input
            type="password"
            value={values.passwordConfirm}
            autoComplete="new-password"
            onChange={(e) => patch("passwordConfirm", e.target.value)}
          />
        </label>
        <label>
          Performance score <span className="muted tiny">0–100</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={values.performanceScore}
            onChange={(e) => patch("performanceScore", e.target.value)}
            required
          />
        </label>
        <label>
          Years of experience
          <input
            type="number"
            min={0}
            step={0.5}
            value={values.experience}
            onChange={(e) => patch("experience", e.target.value)}
            required
          />
        </label>
        {msg && <div className="banner success span-2">{msg}</div>}
        {err && <div className="banner error span-2">{err}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add employee"}
        </button>
      </form>
    </div>
  );
}
