import { subjects } from "./mockData";

const STORAGE_KEY = "it_lab_room_subjects";

function normalizeSubject(subject) {
  const subjectData = { ...subject };
  delete subjectData.code;

  return {
    ...subjectData,
    name: subjectData.name.trim(),
    type: subjectData.type || "LT",
    credits: Number(subjectData.credits),
  };
}

export function getSubjects() {
  const storedSubjects = localStorage.getItem(STORAGE_KEY);

  if (!storedSubjects) {
    return subjects.map(normalizeSubject);
  }

  try {
    const parsedSubjects = JSON.parse(storedSubjects);
    return Array.isArray(parsedSubjects) ? parsedSubjects.map(normalizeSubject) : subjects.map(normalizeSubject);
  } catch {
    return subjects.map(normalizeSubject);
  }
}

export function saveSubjects(nextSubjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSubjects));
}

export function upsertSubject(subject) {
  const currentSubjects = getSubjects();
  const subjectId = subject.id || Date.now();
  const normalizedSubject = normalizeSubject({
    ...subject,
    id: subjectId,
  });

  const existedSubject = currentSubjects.find((item) => item.id === normalizedSubject.id);
  const nextSubjects = existedSubject
    ? currentSubjects.map((item) => (item.id === normalizedSubject.id ? normalizedSubject : item))
    : [...currentSubjects, normalizedSubject];

  saveSubjects(nextSubjects);
  return nextSubjects;
}

export function deleteSubject(subjectId) {
  const nextSubjects = getSubjects().filter((subject) => subject.id !== subjectId);
  saveSubjects(nextSubjects);
  return nextSubjects;
}
