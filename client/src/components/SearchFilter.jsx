export default function SearchFilter({ dept, skill, minScore, onDept, onSkill, onMinScore, onSearch, loading }) {
  return (
    <div className="card search-bar">
      <h3 className="tight-title">Search &amp; filter</h3>
      <div className="filters-row">
        <label>
          Department (exact)
          <input value={dept} onChange={(e) => onDept(e.target.value)} placeholder="e.g. Development" />
        </label>
        <label>
          Skill contains
          <input value={skill} onChange={(e) => onSkill(e.target.value)} placeholder="MongoDB" />
        </label>
        <label>
          Min score
          <input
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => onMinScore(e.target.value)}
            placeholder="0"
          />
        </label>
        <button type="button" className="btn btn-secondary" onClick={onSearch} disabled={loading}>
          {loading ? "Applying..." : "Apply filters"}
        </button>
      </div>
      <p className="muted small">
        Hits <code>GET /api/employees/search</code> · Clear fields and apply to reload all employees.
      </p>
    </div>
  );
}
