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
    SHOW: (id) => `/api/admin/rooms/${id}`,
    COMPUTERS: (id) => `/api/admin/rooms/${id}/computers`,
    UPDATE: (id) => `/api/admin/rooms/${id}`,
    DESTROY: (id) => `/api/admin/rooms/${id}`,
  },
  SUBJECTS: {
    INDEX: "/api/admin/subjects",
    STORE: "/api/admin/subjects",
    SHOW: (id) => `/api/admin/subjects/${id}`,
    UPDATE: (id) => `/api/admin/subjects/${id}`,
    DESTROY: (id) => `/api/admin/subjects/${id}`,
  },
  CLASSES: {
    INDEX: "/api/admin/classes",
    STORE: "/api/admin/classes",
    OPTIONS: "/api/admin/classes/options",
    SHOW: (id) => `/api/admin/classes/${id}`,
    STUDENTS: (id) => `/api/admin/classes/${id}/students`,
    UPDATE: (id) => `/api/admin/classes/${id}`,
    DESTROY: (id) => `/api/admin/classes/${id}`,
  },
  COURSE_SECTIONS: {
    INDEX: "/api/admin/course-sections",
    STORE: "/api/admin/course-sections",
    OPTIONS: "/api/admin/course-sections/options",
    SHOW: (id) => `/api/admin/course-sections/${id}`,
    UPDATE: (id) => `/api/admin/course-sections/${id}`,
    DESTROY: (id) => `/api/admin/course-sections/${id}`,
  },
  SCHEDULES: {
    INDEX: "/api/admin/computer-lab-schedules",
    STORE: "/api/admin/computer-lab-schedules",
    OPTIONS: "/api/admin/computer-lab-schedules/options",
    SHOW: (id) => `/api/admin/computer-lab-schedules/${id}`,
    UPDATE: (id) => `/api/admin/computer-lab-schedules/${id}`,
    DESTROY: (id) => `/api/admin/computer-lab-schedules/${id}`,
  },
  TEACHER_SCHEDULES: {
    INDEX: "/api/teacher/computer-lab-schedules",
  },
  TEACHER_ROOM_BOOKINGS: {
    INDEX: "/api/teacher/room-bookings",
    STORE: "/api/teacher/room-bookings",
    AVAILABILITY: "/api/teacher/room-bookings/availability",
  },
  ADMIN_ROOM_BOOKINGS: {
    INDEX: "/api/admin/room-bookings",
    UPDATE: (id) => `/api/admin/room-bookings/${id}`,
  },
  STUDENT_SCHEDULES: {
    INDEX: "/api/student/computer-lab-schedules",
  },
  COMPUTERS: {
    INDEX: "/api/admin/computers",
    SHOW: (id) => `/api/admin/computers/${id}`,
    UPDATE: (id) => `/api/admin/computers/${id}`,
    DESTROY: (id) => `/api/admin/computers/${id}`,
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || "";
