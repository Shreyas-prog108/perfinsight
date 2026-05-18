import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function AIPage() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const [markdown, setMarkdown] = useState("");
  const [meta, setMeta] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAll() {
      setLoadingList(true);
      try {
        const res = await api.get("/employees");
        setEmployees(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingList(false);
      }
    }
    fetchAll();
  }, []);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(employees.map((e) => e._id)));
  }

  function clearSel() {
    setSelected(new Set());
  }

  async function runAi() {
    setError("");
    setRunning(true);
    setMarkdown("");
    setMeta(null);
    try {
      const body =
        selected.size === 0 ? {} : { employeeIds: Array.from(selected) };
      const res = await api.post("/ai/recommend", body);
      setMarkdown(res.data.markdown || "");
      setMeta({
        count: res.data.analyzedCount,
        fallback: res.data.fallback,
        hint: res.data.hint,
      });
    } catch (e) {
      setError(e.response?.data?.message || e.message || "AI request failed");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="page stack">
      <div className="page-head">
        <h1>AI recommendations</h1>
        <p className="lead-muted">
          OpenAI-powered analysis: ranking, promotion ideas, training paths, and feedback — or rule-based
          fallback if the API key is missing.
        </p>
      </div>

      <div className="card">
        <h3 className="tight-title">Choose employees (optional)</h3>
        <p className="muted small">
          Leave none selected to analyze everyone. Selection is sent as <code>employeeIds</code> to{" "}
          <code>POST /api/ai/recommend</code>.
        </p>
        {loadingList && <p className="muted">Loading roster…</p>}
        <div className="chip-actions">
          <button type="button" className="btn btn-ghost small" onClick={selectAll}>
            Select all
          </button>
          <button type="button" className="btn btn-ghost small" onClick={clearSel}>
            Clear
          </button>
        </div>
        <div className="chip-grid">
          {employees.map((e) => (
            <label key={e._id} className="chip">
              <input
                type="checkbox"
                checked={selected.has(e._id)}
                onChange={() => toggle(e._id)}
              />
              <span>
                {e.name} · {e.performanceScore} · {e.department}
              </span>
            </label>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={runAi} disabled={running}>
          {running ? "Calling OpenAI…" : "Generate recommendations"}
        </button>
        {error && <div className="banner error">{error}</div>}
        {meta && (
          <p className="muted small">
            Analyzed <strong>{meta.count}</strong> employee(s).
            {meta.fallback && <span> Using built-in heuristic (set OPENAI_API_KEY for GPT).</span>}
          </p>
        )}
      </div>

      {markdown && (
        <div className="card ai-output">
          <h3 className="tight-title">AI output</h3>
          <pre className="markdown-pre">{markdown}</pre>
        </div>
      )}
    </div>
  );
}
