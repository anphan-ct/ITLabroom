import { subjects } from "./mockData";

const STORAGE_KEY = "it_lab_room_subjects";

export function getSubjects() {
  const storedSubjects = localStorage.getItem(STORAGE_KEY);

  if (!storedSubjects) {
    return subjects;
  }

  try {
    const parsedSubjects = JSON.parse(storedSubjects);
    return Array.isArray(parsedSubjects) ? parsedSubjects : subjects;
  } catch {
    return subjects;
  }
}

export function saveSubjects(nextSubjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSubjects));
}

export function upsertSubject(subject) {
  const currentSubjects = getSubjects();
  const subjectId = subject.id || Date.now();
  const normalizedSubject = {
    ...subject,
    id: subjectId,
    code: subject.code?.trim().toUpperCase() || `MH${subjectId}`,
    name: subject.name.trim(),
    type: subject.type || "LT",
    credits: Number(subject.credits),
  };

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
