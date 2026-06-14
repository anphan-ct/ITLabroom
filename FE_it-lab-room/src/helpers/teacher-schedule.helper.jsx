import { getAuthSession } from "../services/auth.service";

export function getCurrentTeacherName() {
  const user = getAuthSession()?.user;

  return user?.full_name || user?.name || "";
}

export function filterByCurrentTeacher(items) {
  const teacherName = getCurrentTeacherName();

  if (!teacherName) {
    return [];
  }

  return items.filter((item) => item.teacher === teacherName);
}
