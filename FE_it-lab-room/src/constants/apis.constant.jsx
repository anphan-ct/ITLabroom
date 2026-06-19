export const CONST_APIS = {
  AUTH: {
    ADMIN_LOGIN: "/api/auth/admin/login",
    STUDENT_LOGIN: "/api/auth/students/login",
    TEACHER_LOGIN: "/api/auth/teachers/login",
  },
  COMPUTER_IMPORTS: {
    INDEX: "/api/admin/computer-imports",
    STORE: "/api/admin/computer-imports",
    CODE: "/api/admin/computer-imports/code",
    SHOW: (id) => `/api/admin/computer-imports/${id}`,
  },
  ROOMS: {
    INDEX: "/api/admin/rooms",
    STORE: "/api/admin/rooms",
    DESTROY: (id) => `/api/admin/rooms/${id}`,
  },
  COMPUTERS: {
    INDEX: "/api/admin/computers",
    SHOW: (id) => `/api/admin/computers/${id}`,
    DESTROY: (id) => `/api/admin/computers/${id}`,
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
