import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Monitor, Smartphone } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import { schedules } from "../../../data/mockData";
import { getCurrentStudentClassCode } from "../../../helpers/student-class.helper";

const scheduleStudyDates = {
  1: "10/06/2026",
  2: "12/06/2026",
  3: "17/06/2026",
  4: "19/06/2026",
};

const attendanceStates = {
  1: {
    status: "Đã điểm danh",
    computerCode: "PC001",
    computerName: "Máy 01",
    checkedInAt: "07:05",
  },
  3: {
    status: "Chưa điểm danh",
    computerCode: "",
    computerName: "",
    checkedInAt: "",
  },
};

function getAttendanceState(scheduleId) {
  return attendanceStates[scheduleId] || {
    status: "Chưa có dữ liệu",
    computerCode: "",
    computerName: "",
    checkedInAt: "",
  };
}

export default function StudentAttendanceDetailPage() {
  const { scheduleId } = useParams();
  const schedule = schedules.find((item) => String(item.id) === scheduleId);
  const studentClassCode = getCurrentStudentClassCode();

  if (!schedule || schedule.className !== studentClassCode) {
    return <Navigate to="/student/attendance" replace />;
  }

  const attendance = getAttendanceState(schedule.id);
  const studyDate = schedule.studyDate || scheduleStudyDates[schedule.id] || "-";

  return (
    <AppShell
      role="student"
      title="Chi tiết điểm danh"
      subtitle="Trạng thái điểm danh của buổi học sau khi quét QR máy bằng ứng dụng di động"
    >
      <SectionCard
        title={schedule.subject}
        rightAction={
          <Link
            to="/student/attendance"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <CalendarDays size={22} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">Thông tin buổi học</h3>
                <p className="text-sm text-slate-500">{studyDate}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Lớp</span>
                <span className="font-semibold text-slate-900">{schedule.className}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Thứ/Ca</span>
                <span className="font-semibold text-slate-900">
                  {schedule.day}, {schedule.time}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Phòng</span>
                <span className="font-semibold text-blue-700">{schedule.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Giảng viên</span>
                <span className="font-semibold text-slate-900">{schedule.teacher}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-blue-700">
                <Monitor size={22} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">Kết quả điểm danh</h3>
                <p className="text-sm text-slate-500">Dữ liệu từ bản ghi điểm danh</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Trạng thái</span>
                <StatusBadge value={attendance.status} />
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Check-in</span>
                <span className="font-semibold text-slate-900">
                  {attendance.checkedInAt || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Máy đã quét</span>
                <span className="font-semibold text-blue-700">
                  {attendance.computerCode || "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tên máy</span>
                <span className="font-semibold text-slate-900">
                  {attendance.computerName || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
