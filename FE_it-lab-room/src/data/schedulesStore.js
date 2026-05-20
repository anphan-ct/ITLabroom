import { schedules, shifts } from "./mockData";

const STORAGE_KEY = "it_lab_room_schedules";

export function getSchedules() {
  const defaultSchedules = schedules.map(normalizeSchedule);
  const storedSchedules = localStorage.getItem(STORAGE_KEY);

  if (!storedSchedules) {
    return defaultSchedules;
  }

  try {
    const parsedSchedules = JSON.parse(storedSchedules);
    if (!Array.isArray(parsedSchedules)) {
      return defaultSchedules;
    }

    const normalizedSchedules = parsedSchedules.map(normalizeSchedule);
    const hasLegacyShift = normalizedSchedules.some((schedule) => /^Ca [1-6]$/.test(schedule.shift));

    if (hasLegacyShift) {
      saveSchedules(defaultSchedules);
      return defaultSchedules;
    }

    return normalizedSchedules;
  } catch {
    return defaultSchedules;
  }
}

export function saveSchedules(nextSchedules) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSchedules));
}

function normalizeSchedule(schedule) {
  const matchedShift = shifts.find((shift) => shift.name === schedule.shift);
  const defaultLessonStart = matchedShift?.name === "Ca chiều" ? 7 : 1;
  const defaultLessonEnd = matchedShift?.name === "Ca chiều" ? 12 : 6;

  return {
    ...schedule,
    day: schedule.day,
    shift: schedule.shift,
    time: matchedShift?.time || schedule.time.trim(),
    room: schedule.room,
    subject: schedule.subject,
    className: schedule.className,
    teacher: schedule.teacher,
    weekNumber: Number(schedule.weekNumber),
    lessonStart: Number(schedule.lessonStart || schedule.lesson_start || defaultLessonStart),
    lessonEnd: Number(schedule.lessonEnd || schedule.lesson_end || defaultLessonEnd),
  };
}

export function upsertSchedule(schedule) {
  const normalizedSchedule = normalizeSchedule(schedule);
  const currentSchedules = getSchedules();
  const existedSchedule = currentSchedules.find((item) => item.id === normalizedSchedule.id);
  const nextSchedules = existedSchedule
    ? currentSchedules.map((item) => (item.id === normalizedSchedule.id ? normalizedSchedule : item))
    : [...currentSchedules, { ...normalizedSchedule, id: Date.now() }];

  saveSchedules(nextSchedules);
  return nextSchedules;
}

export function addSchedulesForShifts(schedule, selectedShifts, shiftOptions) {
  const currentSchedules = getSchedules();
  const createdSchedules = selectedShifts.map((shiftName, index) => {
    const shift = shiftOptions.find((item) => item.name === shiftName);

    return normalizeSchedule({
      ...schedule,
      id: Date.now() + index,
      shift: shiftName,
      time: shift?.time || schedule.time,
    });
  });
  const nextSchedules = [...currentSchedules, ...createdSchedules];

  saveSchedules(nextSchedules);
  return nextSchedules;
}

export function deleteSchedule(scheduleId) {
  const nextSchedules = getSchedules().filter((schedule) => schedule.id !== scheduleId);
  saveSchedules(nextSchedules);
  return nextSchedules;
}

export function deleteSchedules(scheduleIds) {
  const deletedIds = new Set(scheduleIds);
  const nextSchedules = getSchedules().filter((schedule) => !deletedIds.has(schedule.id));
  saveSchedules(nextSchedules);
  return nextSchedules;
}
