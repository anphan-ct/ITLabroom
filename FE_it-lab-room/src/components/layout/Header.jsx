import {
  Briefcase,
  GraduationCap,
  LogOut,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({
  onMenuToggle,
  onLogout,
  showMenuButton = true,
  showLoginLinks = true,
  showLogout = false,
  hideLogoutOnMobile = false,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#193D87] bg-[#193D87] text-white shadow-sm">
      {showMenuButton && (
        <button
          onClick={onMenuToggle}
          className="absolute right-3 top-4 z-10 rounded-lg border border-white/30 bg-white/10 p-2 text-white shadow-sm hover:bg-white/20 md:hidden"
          type="button"
          aria-label="Mở tài khoản"
          title="Tài khoản"
        >
          <UserRound size={20} />
        </button>
      )}

      <div
        className={`flex min-h-[72px] items-center gap-4 px-4 sm:px-6 md:pl-6 ${
          showMenuButton ? "pr-14 md:pr-0" : ""
        }`}
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/img/logo.png"
            alt="Logo Cao Thắng"
            className="h-12 w-12 shrink-0 object-contain"
          />
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-sm font-bold uppercase text-white sm:text-base">
              Trường CĐ Kỹ thuật Cao Thắng
            </h1>
            <p className="truncate text-xs font-semibold text-blue-100 sm:text-sm">
              IT Lab Room Management
            </p>
          </div>
        </Link>

        {showLogout && (
          <button
            className={`ml-auto h-10 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/20 ${hideLogoutOnMobile ? "hidden md:inline-flex" : "inline-flex"}`}
            onClick={onLogout}
            type="button"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        )}

        {showLoginLinks && (
          <div className="ml-auto flex items-center gap-2 text-sm font-semibold text-white">
            <Link
              to="/teacher/login"
              className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-2 hover:bg-white/15"
            >
              <Briefcase size={16} />
              <span className="hidden sm:inline">Giảng viên</span>
            </Link>
            <Link
              to="/student/login"
              className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-lg px-2 hover:bg-white/15"
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
