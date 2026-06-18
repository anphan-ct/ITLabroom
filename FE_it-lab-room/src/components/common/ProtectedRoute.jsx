import { Navigate, useLocation } from "react-router-dom";
import { getAuthSession } from "../../services/auth.service";

const loginPaths = {
  admin: "/admin/login",
  teacher: "/teacher/login",
  student: "/student/login",
};

const homePaths = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

export function ProtectedRoute({ role, children }) {
  const location = useLocation();
  const session = getAuthSession();

  if (!session?.accessToken || session.role !== role) {
    return (
      <Navigate
        to={loginPaths[role] || "/student/login"}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export function PublicOnlyRoute({ role, children }) {
  const session = getAuthSession();

  if (session?.accessToken && session.role === role) {
    return <Navigate to={homePaths[role] || "/"} replace />;
  }

  return children;
}
