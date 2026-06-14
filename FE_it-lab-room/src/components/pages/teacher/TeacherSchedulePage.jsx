import { useMemo } from "react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import ScheduleMatrix from "../../common/ScheduleMatrix";
import { schedules, shifts } from "../../../data/mockData";
import {
  filterByCurrentTeacher,
  getCurrentTeacherName,
} from "../../../helpers/teacher-schedule.helper";

export default function TeacherSchedulePage() {
  const teacherName = useMemo(() => getCurrentTeacherName(), []);
  const teacherSchedules = useMemo(() => filterByCurrentTeacher(schedules), []);

  return (
    <AppShell role="teacher" title="Lịch giảng dạy" subtitle="Xem lịch học và lịch phòng máy">
      <SectionCard title="Danh sách lịch dạy">
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
          Giảng viên {teacherName || "chưa xác định"}
        </div>

        {teacherSchedules.length > 0 ? (
          <ScheduleMatrix data={teacherSchedules} shifts={shifts} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Chưa có lịch giảng dạy được phân công.
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}
