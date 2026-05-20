import { useMemo, useState } from "react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import CalendarTable from "../../common/CalendarTable";
import { schedules } from "../../../data/mockData";

export default function StudentSchedulePage() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState("all");

  const classOptions = useMemo(() => {
    const classes = [...new Set(schedules.map((item) => item.className))];
    return classes.filter(Boolean);
  }, []);

  const weekOptions = useMemo(() => {
    const weeks = [...new Set(schedules.map((item) => item.weekNumber))];
    return weeks.filter((item) => item !== undefined && item !== null);
  }, []);

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const matchClass =
        selectedClass === "all" || item.className === selectedClass;

      const matchWeek =
        selectedWeek === "all" ||
        String(item.weekNumber) === String(selectedWeek);

      return matchClass && matchWeek;
    });
  }, [selectedClass, selectedWeek]);

  return (
    <AppShell
      role="student"
      title="Lịch học theo tuần"
      subtitle="Tra cứu lịch học phòng máy"
    >
      <SectionCard title="Danh sách lịch học">
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
          >
            <option value="all">Tất cả lớp</option>
            {classOptions.map((classItem) => (
              <option key={classItem} value={classItem}>
                {classItem}
              </option>
            ))}
          </select>

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

        <CalendarTable data={filteredSchedules} />
      </SectionCard>
    </AppShell>
  );
}
