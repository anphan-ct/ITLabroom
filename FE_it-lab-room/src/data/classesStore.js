import { classes } from "./mockData";

const STORAGE_KEY = "it_lab_room_classes";

function normalizeClassroom(classroom) {
  const { name, ...classroomData } = classroom;

  return {
    ...classroomData,
    code: classroomData.code.trim().toUpperCase(),
    courseYear: classroomData.courseYear?.trim() || "Chưa cập nhật",
    size: Number(classroomData.size),
    advisor: classroomData.advisor.trim(),
  };
}

export function getClasses() {
  const storedClasses = localStorage.getItem(STORAGE_KEY);

  if (!storedClasses) {
    return classes.map(normalizeClassroom);
  }

  try {
    const parsedClasses = JSON.parse(storedClasses);
    return Array.isArray(parsedClasses) ? parsedClasses.map(normalizeClassroom) : classes.map(normalizeClassroom);
  } catch {
    return classes.map(normalizeClassroom);
  }
}

export function saveClasses(nextClasses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextClasses));
}

export function upsertClass(classroom) {
  const normalizedClass = normalizeClassroom(classroom);
  const currentClasses = getClasses();
  const existedClass = currentClasses.find((item) => item.id === normalizedClass.id);
  const nextClasses = existedClass
    ? currentClasses.map((item) => (item.id === normalizedClass.id ? normalizedClass : item))
    : [...currentClasses, { ...normalizedClass, id: Date.now() }];

  saveClasses(nextClasses);
  return nextClasses;
}

export function deleteClass(classId) {
  const nextClasses = getClasses().filter((classroom) => classroom.id !== classId);
  saveClasses(nextClasses);
  return nextClasses;
}
