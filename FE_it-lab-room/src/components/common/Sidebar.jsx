import { NavLink } from "react-router-dom";
import { roleMenus } from "./navigation.jsx";

export default function Sidebar({ role = "admin", open = false, onClose }) {
  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-900/40 transition md:hidden ${
          open ? "block" : "hidden"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col bg-slate-950 pt-20 text-white shadow-xl transition-transform md:static md:z-auto md:h-full md:shrink-0 md:translate-x-0 md:rounded-lg md:border md:border-slate-800 md:pt-0 md:shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {(roleMenus[role] || []).map((item) => {
            const Icon = item.icon;

            if (item.children?.length) {
              return (
                <div key={item.to} className="group space-y-1">
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={linkClassName}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>

                  <div className="ml-4 hidden space-y-1 border-l border-slate-800 pl-3 group-hover:block group-focus-within:block">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;

                      return (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                              isActive
                                ? "bg-blue-600 text-white shadow"
                                : "text-slate-400 hover:bg-white/10 hover:text-white"
                            }`
                          }
                        >
                          <ChildIcon size={16} />
                          <span>{child.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === `/${role}`}
                className={linkClassName}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
