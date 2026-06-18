import { initialCourseSections } from "../components/pages/admin/adminPageData";

const STORAGE_KEY = "it_lab_room_course_sections";

function normalizeCourseSection(courseSection) {
  return {
    ...courseSection,
    code: courseSection.code?.trim().toUpperCase() || "",
    subject: courseSection.subject?.trim() || "",
    academicYear: courseSection.academicYear?.trim() || "",
    teacher: courseSection.teacher?.trim() || "",
    room: courseSection.room?.trim() || "",
    maxStudents: Number(courseSection.maxStudents || 0),
    status: courseSection.status || "Hoạt động",
    note: courseSection.note?.trim() || "",
  };
}

export function getCourseSections() {
  const storedCourseSections = localStorage.getItem(STORAGE_KEY);

  if (!storedCourseSections) {
    return initialCourseSections.map(normalizeCourseSection);
  }

  try {
    const parsedCourseSections = JSON.parse(storedCourseSections);
    return Array.isArray(parsedCourseSections)
      ? parsedCourseSections.map(normalizeCourseSection)
      : initialCourseSections.map(normalizeCourseSection);
  } catch {
    return initialCourseSections.map(normalizeCourseSection);
  }
}

export function saveCourseSections(nextCourseSections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCourseSections));
}

export function upsertCourseSection(courseSection) {
  const currentCourseSections = getCourseSections();
  const courseSectionId = courseSection.id || Date.now();
  const normalizedCourseSection = normalizeCourseSection({
    ...courseSection,
    id: courseSectionId,
  });
  const existedCourseSection = currentCourseSections.find((item) => item.id === normalizedCourseSection.id);
  const nextCourseSections = existedCourseSection
    ? currentCourseSections.map((item) => (item.id === normalizedCourseSection.id ? normalizedCourseSection : item))
    : [...currentCourseSections, normalizedCourseSection];

  saveCourseSections(nextCourseSections);
  return nextCourseSections;
}

export function deleteCourseSection(courseSectionId) {
  const nextCourseSections = getCourseSections().filter((courseSection) => courseSection.id !== courseSectionId);
  saveCourseSections(nextCourseSections);
  return nextCourseSections;
}
