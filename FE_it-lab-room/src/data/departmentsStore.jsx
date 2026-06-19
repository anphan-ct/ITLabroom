import { initialDepartments } from "../components/pages/admin/adminPageData";

const STORAGE_KEY = "it_lab_room_departments";

function normalizeDepartment(department) {
  return {
    ...department,
    code: department.code?.trim().toUpperCase() || "",
    name: department.name?.trim() || "",
    status: department.status || "Hoạt động",
    note: department.note?.trim() || "",
  };
}

export function getDepartments() {
  const storedDepartments = localStorage.getItem(STORAGE_KEY);

  if (!storedDepartments) {
    return initialDepartments.map(normalizeDepartment);
  }

  try {
    const parsedDepartments = JSON.parse(storedDepartments);
    return Array.isArray(parsedDepartments)
      ? parsedDepartments.map(normalizeDepartment)
      : initialDepartments.map(normalizeDepartment);
  } catch {
    return initialDepartments.map(normalizeDepartment);
  }
}

export function saveDepartments(nextDepartments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDepartments));
}

export function upsertDepartment(department) {
  const currentDepartments = getDepartments();
  const departmentId = department.id || Date.now();
  const normalizedDepartment = normalizeDepartment({
    ...department,
    id: departmentId,
  });
  const existedDepartment = currentDepartments.find((item) => item.id === normalizedDepartment.id);
  const nextDepartments = existedDepartment
    ? currentDepartments.map((item) => (item.id === normalizedDepartment.id ? normalizedDepartment : item))
    : [...currentDepartments, normalizedDepartment];

  saveDepartments(nextDepartments);
  return nextDepartments;
}

export function deleteDepartment(departmentId) {
  const nextDepartments = getDepartments().filter((department) => department.id !== departmentId);
  saveDepartments(nextDepartments);
  return nextDepartments;
}
