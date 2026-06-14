export const CONST_APIS = {
  AUTH: {
    ADMIN_LOGIN: "/api/auth/admin/login",
    STUDENT_LOGIN: "/api/auth/students/login",
    TEACHER_LOGIN: "/api/auth/teachers/login",
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
