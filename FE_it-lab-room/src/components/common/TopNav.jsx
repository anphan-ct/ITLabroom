import { NavLink } from "react-router-dom";
import { roleMenus } from "./navigation.jsx";

export default function TopNav({ role }) {
  const menus = roleMenus[role] || [];

  return (
    <nav className="shrink-0 border-b border-blue-700 bg-blue-600 shadow-sm">
      <div className="flex min-h-[56px] items-center gap-1 overflow-x-auto px-3 sm:px-4">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === `/${role}`}
              className={({ isActive }) =>
                `inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-4 ${
                  isActive ? "bg-blue-800 shadow-inner" : ""
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
