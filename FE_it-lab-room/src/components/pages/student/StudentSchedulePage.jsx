import { useMemo, useState } from "react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import ScheduleMatrix from "../../common/ScheduleMatrix";
import { schedules, shifts } from "../../../data/mockData";
import {
  filterByCurrentStudentClass,
  getCurrentStudentClassCode,
} from "../../../helpers/student-class.helper";

export default function StudentSchedulePage() {
  const [selectedWeek, setSelectedWeek] = useState("all");

  const studentClassCode = useMemo(() => getCurrentStudentClassCode(), []);
  const studentSchedules = useMemo(() => filterByCurrentStudentClass(schedules), []);

  const weekOptions = useMemo(() => {
    const weeks = [...new Set(studentSchedules.map((item) => item.weekNumber))];
    return weeks.filter((item) => item !== undefined && item !== null);
  }, [studentSchedules]);

  const filteredSchedules = useMemo(() => {
    return studentSchedules.filter((item) => {
      const matchWeek =
        selectedWeek === "all" ||
        String(item.weekNumber) === String(selectedWeek);

      return matchWeek;
    });
  }, [selectedWeek, studentSchedules]);

  return (
    <AppShell
      role="student"
      title="Lịch học theo tuần"
      subtitle="Tra cứu lịch học phòng máy"
    >
      <SectionCard title="Danh sách lịch học">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
            Lớp {studentClassCode || "chưa phân lớp"}
          </div>

          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
          >
            <option value="all">Tất cả tuần</option>
            {weekOptions.map((weekItem) => (
              <option key={weekItem} value={weekItem}>
                Tuần {weekItem}
              </option>
            ))}
          </select>
        </div>

        {filteredSchedules.length > 0 ? (
          <ScheduleMatrix data={filteredSchedules} shifts={shifts} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Chưa có lịch học cho lớp của bạn.
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}
