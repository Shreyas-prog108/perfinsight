import { useEffect, useState } from "react";
import EmployeeForm from "../components/EmployeeForm.jsx";
import SearchFilter from "../components/SearchFilter.jsx";
import EmployeeList from "../components/EmployeeList.jsx";
import api from "../services/api.js";

export default function EmployeesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState("");
  const [skill, setSkill] = useState("");
  const [minScore, setMinScore] = useState("");

  async function loadAll() {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      setItems(res.data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function applySearch() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (dept.trim()) qs.set("department", dept.trim());
      if (skill.trim()) qs.set("skill", skill.trim());
      if (minScore !== "") qs.set("minScore", String(minScore));
      const suffix = qs.toString();
      const res = await api.get(`/employees/search${suffix ? `?${suffix}` : ""}`);
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="page stack">
      <div className="page-head">
        <h1>Employees &amp; performance</h1>
        <p className="lead-muted">
          Signed-in HR and admin accounts use this dashboard to add, edit, or remove employee records. All roster APIs
          require a staff JWT — public callers cannot mutate data.
        </p>
      </div>
      <EmployeeForm onCreated={() => loadAll()} />
      <SearchFilter
        dept={dept}
        skill={skill}
        minScore={minScore}
        onDept={setDept}
        onSkill={setSkill}
        onMinScore={setMinScore}
        onSearch={applySearch}
        loading={loading}
      />
      <EmployeeList items={items} loading={loading} reload={loadAll} />
    </div>
  );
}
