import { useMemo, useState } from "react";
import api from "../services/api.js";

function ScoreEditor({ emp, onDone }) {
  const [score, setScore] = useState(String(emp.performanceScore));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await api.patch(`/employees/${emp._id}/performance`, {
        performanceScore: Number(score),
      });
      onDone();
    } catch (e) {
      alert(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <span className="inline-edit">
      <input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
      <button type="button" className="btn btn-ghost small" disabled={saving} onClick={save}>
        {saving ? "..." : "Save"}
      </button>
    </span>
  );
}

export default function EmployeeList({ items, loading, reload }) {
  const sortedPreview = useMemo(
    () => [...items].sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0)),
    [items]
  );

  async function remove(id) {
    if (!confirm("Delete this employee record?")) return;
    try {
      await api.delete(`/employees/${id}`);
      reload();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  }

  return (
    <div className="card">
      <div className="row-between">
        <h2 className="tight-title">Employee list ({items.length})</h2>
        <span className="muted small">Sorted preview by score · updates persist via API</span>
      </div>
      {loading && <div className="muted">Loading…</div>}
      {!loading && !items.length && <p className="muted">No employees yet. Register one above.</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Yrs exp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPreview.map((e, i) => (
              <tr key={e._id}>
                <td>{i + 1}</td>
                <td>{e.name}</td>
                <td className="mono small">{e.email}</td>
                <td>{e.department}</td>
                <td className="tags">
                  {(e.skills || []).map((s) => (
                    <span key={s} className="pill">
                      {s}
                    </span>
                  ))}
                </td>
                <td>
                  <ScoreEditor emp={e} onDone={reload} />
                </td>
                <td>{e.experience}</td>
                <td>
                  <button type="button" className="btn btn-ghost danger small" onClick={() => remove(e._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
