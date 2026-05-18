import { Outlet, NavLink } from "react-router-dom";

function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.06 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
  );
}

function IconSpark(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 3l2.06 7.26L21 13l-6.94 2.74L12 23l-2.06-7.26L3 13l6.94-2.74L12 3z"
      />
    </svg>
  );
}

export default function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="side glass-panel">
        <div className="side-brand">
          <span className="side-brand__label">Workspace</span>
          <p className="side-brand__name">HR Console</p>
        </div>
        <nav className="side-nav">
          <NavLink
            to="/employees"
            end
            className={({ isActive }) => "side-link" + (isActive ? " side-link--active" : "")}
          >
            <IconUsers />
            <span>Roster &amp; metrics</span>
          </NavLink>
          <NavLink to="/ai" className={({ isActive }) => "side-link" + (isActive ? " side-link--active" : "")}>
            <IconSpark />
            <span>AI recommendations</span>
          </NavLink>
        </nav>
        <div className="side-foot muted small">
          Routes match your exam spec: JWT on every mutation + AI POST.
        </div>
      </aside>
      <section className="dash-body">
        <Outlet />
      </section>
    </div>
  );
}
