const defaultDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const defaultShifts = [
  { name: "Ca sáng", time: "06:30 - 11:25" },
  { name: "Ca chiều", time: "12:30 - 17:30" },
];

function sortSchedules(firstSchedule, secondSchedule) {
  return Number(firstSchedule.weekNumber || 0) - Number(secondSchedule.weekNumber || 0)
    || String(firstSchedule.room || "").localeCompare(String(secondSchedule.room || ""))
    || Number(firstSchedule.lessonStart || 0) - Number(secondSchedule.lessonStart || 0);
}

function getCellSchedules(data, day, shiftName) {
  return data
    .filter((schedule) => schedule.day === day && schedule.shift === shiftName)
    .sort(sortSchedules);
}

function getLessonsForShift(shiftName) {
  const startLesson = shiftName === "Ca chiều" ? 7 : 1;

  return Array.from({ length: 6 }, (_, index) => startLesson + index);
}

function getLessonSchedules(data, day, shiftName, lesson) {
  return getCellSchedules(data, day, shiftName).filter((schedule) => (
    Number(schedule.lessonStart) === lesson
  ));
}

function isLessonCoveredByPreviousSchedule(data, day, shiftName, lesson) {
  return getCellSchedules(data, day, shiftName).some((schedule) => (
    Number(schedule.lessonStart) < lesson && lesson <= Number(schedule.lessonEnd)
  ));
}

function getLessonSpan(schedule, lessons) {
  const firstLesson = lessons[0];
  const lastLesson = lessons[lessons.length - 1];
  const lessonStart = Math.max(Number(schedule.lessonStart), firstLesson);
  const lessonEnd = Math.min(Number(schedule.lessonEnd), lastLesson);

  return Math.max(1, lessonEnd - lessonStart + 1);
}

function getWeekLabel(data) {
  const weekNumbers = [...new Set(data.map((schedule) => schedule.weekNumber))]
    .filter((weekNumber) => weekNumber !== undefined && weekNumber !== null)
    .sort((firstWeek, secondWeek) => Number(firstWeek) - Number(secondWeek));

  if (weekNumbers.length === 0) {
    return "Chưa có tuần";
  }

  if (weekNumbers.length === 1) {
    return `Tuần ${weekNumbers[0]}`;
  }

  return `Tuần ${weekNumbers.join(", ")}`;
}

export default function ScheduleMatrix({
  data,
  days = defaultDays,
  shifts = defaultShifts,
  renderActions,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
      <div className="min-w-[1040px]">
        <div className="flex items-center justify-between border-b border-slate-300 bg-white px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lịch sử dụng phòng máy
            </p>
            <h3 className="mt-1 text-base font-bold text-slate-900">
              {getWeekLabel(data)}
            </h3>
          </div>
          <div className="text-sm font-semibold text-slate-500">
            {data.length} lịch
          </div>
        </div>

        <table className="min-w-full table-fixed text-sm">
          <thead className="border-b border-slate-300 bg-slate-100">
            <tr>
              <th className="w-[120px] px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                Ca học
              </th>
              <th className="w-[80px] border-l border-slate-300 px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                Tiết
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border-l border-slate-300 px-4 py-3 text-left text-sm font-bold text-slate-900"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => {
              const lessons = getLessonsForShift(shift.name);

              return lessons.map((lesson, lessonIndex) => (
                <tr
                  key={`${shift.name}-${lesson}`}
                  className="border-t border-slate-300 align-top"
                >
                  {lessonIndex === 0 && (
                    <td
                      rowSpan={lessons.length}
                      className="border-r border-slate-300 bg-slate-100 px-4 py-4 align-top"
                    >
                      <div className="text-sm font-bold text-slate-900">
                        {shift.name}
                      </div>
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        {shift.time}
                      </div>
                    </td>
                  )}

                  <td className="border-r border-slate-300 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                    Tiết {lesson}
                  </td>

                  {days.map((day) => {
                    const lessonSchedules = getLessonSchedules(data, day, shift.name, lesson);
                    const coveredByPreviousSchedule = isLessonCoveredByPreviousSchedule(data, day, shift.name, lesson);

                    if (coveredByPreviousSchedule) {
                      return null;
                    }

                    return (
                      <td
                        key={`${shift.name}-${lesson}-${day}`}
                        rowSpan={lessonSchedules.length > 0 ? getLessonSpan(lessonSchedules[0], lessons) : 1}
                        className="h-[58px] border-l border-slate-300 p-1.5"
                      >
                        {lessonSchedules.length > 0 ? (
                          <div className="flex h-full flex-col items-center justify-center gap-1.5">
                            {lessonSchedules.map((schedule) => (
                              <article
                                key={schedule.id}
                                className="flex min-h-[56px] w-[calc(100%-16px)] flex-none flex-col justify-center gap-2 rounded-md border border-blue-200 bg-blue-50/80 px-4 py-3 shadow-sm"
                              >
                                <div className="min-w-0">
                                  <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                                    {schedule.subject}
                                  </h3>
                                  <p className="mt-1 text-xs font-medium text-slate-600">
                                    {schedule.className} - {schedule.room}
                                  </p>
                                </div>

                                <div className="grid gap-0.5 text-xs font-medium text-slate-600">
                                  <span>{schedule.teacher}</span>
                                  <span>{schedule.time}</span>
                                </div>

                                {renderActions && (
                                  <div className="mt-2 border-t border-blue-200 pt-2">
                                    {renderActions(schedule)}
                                  </div>
                                )}
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="flex h-full min-h-[46px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-400">
                            Trống
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
