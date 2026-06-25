import { NavLink } from "react-router-dom";
import { roleMenus } from "./navigation.jsx";

export default function TopNav({ role }) {
  const menus = roleMenus[role] || [];

  return (
      <nav className="relative z-20 hidden shrink-0 border-b border-slate-200 bg-white shadow-sm md:block">
      <div className="app-scrollbar flex min-h-[56px] items-center gap-2 overflow-x-auto px-5">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              className={({ isActive }) =>
                `inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition sm:px-4 ${
                  isActive
                    ? "border-[#193D87] bg-[#193D87] text-white shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      </nav>
  );
}
