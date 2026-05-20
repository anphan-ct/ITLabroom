import {
  Briefcase,
  GraduationCap,
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  onMenuToggle,
  onLogout,
  roleLabel,
  showMenuButton = true,
  showLoginLinks = true,
  showLogout = false,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      {showMenuButton && (
        <button
          onClick={onMenuToggle}
          className="absolute left-3 top-3 z-10 rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          type="button"
        >
          <Menu size={20} />
        </button>
      )}

      <div
        className={`flex min-h-[72px] items-center gap-4 px-4 sm:px-6 md:pl-6 ${
          showMenuButton ? "pl-14" : ""
        }`}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/img/logo.png"
            alt="Logo Cao Thắng"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold uppercase text-red-600 sm:text-base">
              Trường CĐ Kỹ thuật Cao Thắng
            </h1>
            <p className="truncate text-xs font-semibold text-slate-600 sm:text-sm">
              IT Lab Room Management
            </p>
          </div>
        </Link>

        <div className="ml-auto hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 lg:flex">
          <ShieldCheck size={16} className="text-emerald-600" />
          {roleLabel || "Cổng truy cập"}
        </div>

        {showLogout && (
          <button
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 lg:ml-0"
            onClick={onLogout}
            type="button"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        )}

        {showLoginLinks && (
          <div className="ml-auto flex items-center gap-2 text-sm font-medium text-blue-700 lg:ml-0">
            <Link
              to="/teacher/login"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 hover:bg-blue-50"
            >
              <Briefcase size={16} />
              <span className="hidden sm:inline">Giảng viên</span>
            </Link>
            <Link
              to="/student/login"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 hover:bg-blue-50"
            >
              <GraduationCap size={18} />
              <span className="hidden sm:inline">Sinh viên</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
