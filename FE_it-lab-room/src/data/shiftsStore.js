import { shifts } from "./mockData";

const STORAGE_KEY = "it_lab_room_shifts";

function toShiftRecord(shift) {
  const [startTime = "", endTime = ""] = shift.time?.split(" - ") || [];

  return {
    id: shift.id,
    code: shift.code,
    name: shift.name,
    start_time: shift.start_time || startTime,
    end_time: shift.end_time || endTime,
    status: shift.status || "Hoạt động",
  };
}

export function getShifts() {
  const defaultShifts = shifts.map(toShiftRecord);
  const storedShifts = localStorage.getItem(STORAGE_KEY);

  if (!storedShifts) {
    return defaultShifts;
  }

  try {
    const parsedShifts = JSON.parse(storedShifts);
    if (!Array.isArray(parsedShifts)) {
      return defaultShifts;
    }

    const hasOldLessonShifts = parsedShifts.some((shift) => /^Ca [1-6]$/.test(shift.name));

    if (hasOldLessonShifts) {
      saveShifts(defaultShifts);
      return defaultShifts;
    }

    return parsedShifts;
  } catch {
    return defaultShifts;
  }
}

export function saveShifts(nextShifts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextShifts));
}

export function upsertShift(shift) {
  const normalizedShift = {
    ...shift,
    code: shift.code.trim().toUpperCase(),
    name: shift.name.trim(),
    start_time: shift.start_time,
    end_time: shift.end_time,
    status: shift.status,
  };
  const currentShifts = getShifts();
  const existedShift = currentShifts.find((item) => item.id === normalizedShift.id);
  const nextShifts = existedShift
    ? currentShifts.map((item) => (item.id === normalizedShift.id ? normalizedShift : item))
    : [...currentShifts, { ...normalizedShift, id: Date.now() }];

  saveShifts(nextShifts);
  return nextShifts;
}

export function deleteShift(shiftId) {
  const nextShifts = getShifts().filter((shift) => shift.id !== shiftId);
  saveShifts(nextShifts);
  return nextShifts;
}
