import { Navigate, Outlet, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import AIPage from "./pages/AIPage.jsx";

function ProtectedRoute() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function GuestOnly({ children }) {
  const { token } = useAuth();
  if (token) return <Navigate to="/employees" replace />;
  return children;
}

function Shell() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLanding = pathname === "/";
  const isAuthPage = pathname === "/login";

  function goBrand() {
    navigate(token ? "/employees" : "/");
  }

  return (
    <div className="app-shell">
      <header className={`site-header ${isLanding ? "site-header--transparent" : ""}`}>
        <div className="site-header__inner">
          <div className="brand" onClick={goBrand} role="presentation">
            <span className="brand-mark" aria-hidden />
            <span className="brand-text">PerfInsight</span>
          </div>
          <nav className="site-nav">
            {!token && (
              <Link className="site-nav__link" to="/">
                Home
              </Link>
            )}
            {token ? (
              <>
                <span className="user-chip" title="Signed-in account">
                  <span className="user-chip__dot" />
                  <span className="user-chip__trunc">{user?.email}</span>
                </span>
                <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <Link className="btn btn-glow btn-sm" to="/login">
                Staff login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className={`main ${isLanding || isAuthPage ? "main--flush" : "main--app"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route path="/signup" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/ai" element={<AIPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
