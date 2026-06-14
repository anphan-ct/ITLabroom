import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import TopNav from "./TopNav.jsx";
import Header from "../layout/Header.jsx";
import Footer from "../layout/Footer.jsx";
import { clearAuthSession } from "../../services/authService.jsx";

const roleLabels = {
  admin: "Quản trị hệ thống",
  teacher: "Giảng viên",
  student: "Sinh viên",
};

const loginPaths = {
  admin: "/admin/login",
  teacher: "/teacher/login",
  student: "/student/login",
};

export default function AppShell({ role, title, subtitle, children }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = role === "admin";

  const handleLogout = () => {
    clearAuthSession();
    navigate(loginPaths[role] || "/", { replace: true });
  };

  return (
    <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
      <Header
        onMenuToggle={() => setOpen(true)}
        onLogout={handleLogout}
        roleLabel={roleLabels[role]}
        showMenuButton={isAdmin}
        showLoginLinks={false}
        showLogout
      />

      {!isAdmin && <TopNav role={role} />}

      <div
        className={`flex min-h-0 flex-1 ${
          isAdmin ? "gap-4 px-3 py-3 md:gap-5 md:px-4 md:py-4" : "px-3 py-4 sm:px-4 sm:py-5"
        }`}
      >
        {isAdmin && (
          <Sidebar role={role} open={open} onClose={() => setOpen(false)} />
        )}

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] space-y-4 pb-3 md:space-y-5 md:pb-4">
            {(title || subtitle) && (
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {roleLabels[role] || "IT Lab Room"}
                    </p>
                    <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                    )}
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    Học kỳ 2 - Năm học 2025-2026
                  </div>
                </div>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      {!isAdmin && <Footer />}
    </div>
  );
}
