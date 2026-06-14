import { getClasses } from "../data/classesStore";
import { getAuthSession } from "../services/auth.service";

export function getCurrentStudentClassCode() {
  const student = getAuthSession()?.user?.student;

  if (!student) {
    return "";
  }

  const classroom = getClasses().find((item) => item.id === Number(student.class_id));

  return classroom?.code || student.class_code || "";
}

export function filterByCurrentStudentClass(items) {
  const classCode = getCurrentStudentClassCode();

  if (!classCode) {
    return [];
  }

  return items.filter((item) => item.className === classCode);
}
