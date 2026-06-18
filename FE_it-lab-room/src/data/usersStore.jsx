import { users } from "./mockData";
import { getClasses } from "./classesStore";

const STORAGE_KEY = "it_lab_room_users";

function cleanString(value) {
  return String(value || "").trim();
}

function normalizeUser(user) {
  const isLegacyClassMonitor = user.role === "Lớp trưởng";
  const isStudent = user.role === "Sinh viên" || isLegacyClassMonitor;
  const isTeacher = user.role === "Giảng viên";
  const classes = getClasses();
  const classroom = isStudent && user.classId
    ? classes.find((item) => item.id === Number(user.classId))
    : classes.find((item) => item.code === user.className);

  return {
    ...user,
    code: isStudent || isTeacher ? cleanString(user.code).toUpperCase() : "",
    name: cleanString(user.name),
    email: cleanString(user.email),
    password: cleanString(user.password),
    phone: cleanString(user.phone),
    gender: cleanString(user.gender),
    dateOfBirth: cleanString(user.dateOfBirth),
    department: "",
    classId: isStudent ? classroom?.id || user.classId || "" : "",
    className: isStudent ? classroom?.code || user.className || "Chưa phân lớp" : "",
    course: isStudent ? cleanString(user.course) || "Chưa cập nhật" : "",
    role: isLegacyClassMonitor ? "Sinh viên" : user.role,
    status: user.status,
  };
}

export function getUsers() {
  const storedUsers = localStorage.getItem(STORAGE_KEY);

  if (!storedUsers) {
    return users.map(normalizeUser);
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);
    return Array.isArray(parsedUsers) ? parsedUsers.map(normalizeUser) : users.map(normalizeUser);
  } catch {
    return users.map(normalizeUser);
  }
}

export function saveUsers(nextUsers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUsers));
}

export function addUser(user) {
  const nextUsers = [
    ...getUsers(),
    {
      ...normalizeUser(user),
      id: Date.now(),
    },
  ];

  saveUsers(nextUsers);
  return nextUsers;
}

export function updateUser(updatedUser) {
  const normalizedUser = normalizeUser(updatedUser);
  const nextUsers = getUsers().map((user) => {
    return user.id === updatedUser.id
      ? {
          ...user,
          ...normalizedUser,
        }
      : user;
  });

  saveUsers(nextUsers);
  return nextUsers;
}
