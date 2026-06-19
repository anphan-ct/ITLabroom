import { useLayoutEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { roleMenus } from "./navigation.jsx";

export default function Sidebar({ role = "admin", open = false, onClose }) {
  const location = useLocation();
  const navRef = useRef(null);
  const scrollStorageKey = `it-lab-room-sidebar-scroll-${role}`;

  useLayoutEffect(() => {
    const savedScrollTop = Number(sessionStorage.getItem(scrollStorageKey) || 0);

    if (navRef.current) {
      navRef.current.scrollTop = savedScrollTop;
    }
  }, [location.pathname, scrollStorageKey]);

  const handleNavScroll = (event) => {
    sessionStorage.setItem(scrollStorageKey, String(event.currentTarget.scrollTop));
  };

  const linkClassName = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
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
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white pt-20 shadow-xl transition-transform md:static md:z-auto md:h-full md:shrink-0 md:translate-x-0 md:rounded-lg md:border md:pt-0 md:shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden border-b border-slate-200 px-4 py-4 md:block">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Điều hướng</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Quản trị phòng máy</p>
        </div>
        <nav
          ref={navRef}
          onScroll={handleNavScroll}
          className="app-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4"
        >
          {(roleMenus[role] || []).map((item) => {
            const Icon = item.icon;

            if (item.children?.length) {
              const hasActiveChild = item.children.some((child) => child.to === location.pathname);

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

                  <div className={`ml-4 space-y-1 border-l border-slate-200 pl-3 group-hover:block group-focus-within:block ${hasActiveChild ? "block" : "hidden"}`}>
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
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
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
