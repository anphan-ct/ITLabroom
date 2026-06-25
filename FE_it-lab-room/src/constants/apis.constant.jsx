export const CONST_APIS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    GOOGLE_LOGIN: "/api/auth/google-login",
    ADMIN_LOGIN: "/api/auth/admin/login",
    STUDENT_LOGIN: "/api/auth/students/login",
    TEACHER_LOGIN: "/api/auth/teachers/login",
  },
  // Quản lý tài khoản người dùng
  USERS: {
    INDEX: "/api/admin/users",
    STORE: "/api/admin/users",
    IMPORT: "/api/admin/users/import",
    SHOW: (id) => `/api/admin/users/${id}`,
    UPDATE: (id) => `/api/admin/users/${id}`,
    TOGGLE_STATUS: (id) => `/api/admin/users/${id}/toggle-status`,
    RESET_PASSWORD: (id) => `/api/admin/users/${id}/reset-password`,
    DESTROY: (id) => `/api/admin/users/${id}`,
  },
  // Phòng ban (dropdown)
  DEPARTMENTS: {
    INDEX: "/api/admin/departments",
  },
  // Lớp học (dropdown)
  CLASSES: {
    INDEX: "/api/admin/classes",
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
  COMPUTER_TRANSFERS: {
    INDEX: "/api/admin/computer-transfers",
    STORE: "/api/admin/computer-transfers",
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

