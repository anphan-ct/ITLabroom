import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import ScheduleMatrix from "../../common/ScheduleMatrix";
import {
  mapComputerLabWeekOption,
  getScheduleWeekOptions,
  getWeekRangeForDate,
  getWeekRangeKey,
  isScheduleInWeek,
  mapComputerLabSchedule,
} from "../../../helpers/computer-lab-schedule.helper";
import { getCurrentTeacherName } from "../../../helpers/teacher-schedule.helper";
import { getTeacherComputerLabSchedulesFromApi } from "../../../services/schedules.service";

export default function TeacherSchedulePage() {
  const teacherName = useMemo(() => getCurrentTeacherName(), []);
  const currentWeekRange = useMemo(() => getWeekRangeForDate(), []);
  const [selectedWeek, setSelectedWeek] = useState(() => getWeekRangeKey(currentWeekRange));
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getTeacherComputerLabSchedulesFromApi({ per_page: 100 })
      .then((response) => {
        if (isMounted) {
          setTeacherSchedules((response.data?.items || []).map(mapComputerLabSchedule));
          setWeeks((response.data?.week_options || []).map(mapComputerLabWeekOption));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải lịch giảng dạy.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const weekOptions = useMemo(() => {
    return getScheduleWeekOptions(teacherSchedules, currentWeekRange, weeks);
  }, [currentWeekRange, teacherSchedules, weeks]);

  const filteredSchedules = useMemo(() => {
    const selectedOption = weekOptions.find((option) => option.key === selectedWeek);

    if (!selectedOption) {
      return [];
    }

    return teacherSchedules.filter((schedule) => isScheduleInWeek(schedule, selectedOption.range));
  }, [selectedWeek, teacherSchedules, weekOptions]);

  return (
    <AppShell role="teacher">
      <SectionCard title="Danh sách lịch dạy">
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
            Giảng viên {teacherName || "chưa xác định"}
          </div>

          <select value={selectedWeek} onChange={(event) => setSelectedWeek(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none">
            {weekOptions.map((weekItem) => <option key={weekItem.key} value={weekItem.key}>{weekItem.label}</option>)}
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
        )}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">Đang tải lịch giảng dạy...</div>
        ) : filteredSchedules.length > 0 ? (
          <ScheduleMatrix
            data={filteredSchedules}
            renderActions={() => (
              <Link
                to="/teacher/attendance"
                className="block w-full rounded-lg bg-[#193D87] px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-[#102752]"
              >
                Điểm danh sinh viên
              </Link>
            )}
            renderMobileActions={() => (
              <Link
                to="/teacher/attendance"
                className="block w-full rounded-lg bg-[#193D87] px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#102752]"
              >
                Điểm danh sinh viên
              </Link>
            )}
          />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">Chưa có lịch giảng dạy cho tuần đã chọn.</div>
        )}
      </SectionCard>
    </AppShell>
  );
}
