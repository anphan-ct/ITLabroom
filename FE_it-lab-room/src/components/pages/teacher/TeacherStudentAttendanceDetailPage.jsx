import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Monitor, UserRound } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";

const studentAttendanceDetails = [
  {
    id: 1,
    scheduleId: 1,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    className: "CNTT01",
    subject: "Lập trình web",
    day: "Thứ 2",
    time: "07:00 - 09:00",
    room: "PM01",
    checkedInAt: "07:05",
    attendanceStatus: "Có mặt",
    computerCode: "PC001",
    computerName: "Máy 01",
    computerStatus: "Hoạt động bình thường",
    note: "Không có ghi chú",
  },
  {
    id: 2,
    scheduleId: 1,
    studentId: "SV002",
    studentName: "Trần Thị Lan",
    className: "CNTT01",
    subject: "Lập trình web",
    day: "Thứ 2",
    time: "07:00 - 09:00",
    room: "PM01",
    checkedInAt: "07:15",
    attendanceStatus: "Đi trễ",
    computerCode: "PC002",
    computerName: "Máy 02",
    computerStatus: "Lỗi nhẹ",
    note: "Bàn phím gõ chậm",
  },
];

const attendanceStatusStyles = {
  "Có mặt": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đi trễ": "border-amber-200 bg-amber-50 text-amber-700",
  "Vắng": "border-rose-200 bg-rose-50 text-rose-700",
};

const computerStatusStyles = {
  "Hoạt động bình thường": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Lỗi nhẹ": "border-amber-200 bg-amber-50 text-amber-700",
  "Hỏng": "border-rose-200 bg-rose-50 text-rose-700",
};

export default function TeacherStudentAttendanceDetailPage() {
  const { studentId } = useParams();
  const detail = studentAttendanceDetails.find(
    (item) => item.studentId === studentId,
  );

  if (!detail) {
    return <Navigate to="/teacher/attendance" replace />;
  }

  return (
    <AppShell
      role="teacher"
      title="Chi tiết điểm danh sinh viên"
      subtitle="Xem trạng thái điểm danh và tình trạng máy sinh viên đã gửi"
    >
      <SectionCard
        title={detail.studentName}
        rightAction={
          <Link
            to="/teacher/attendance"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserRound size={22} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{detail.studentName}</h3>
                <p className="text-sm text-slate-500">
                  {detail.studentId} - {detail.className}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Môn học</span>
                <span className="font-semibold text-slate-900">{detail.subject}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Buổi học</span>
                <span className="font-semibold text-slate-900">
                  {detail.day}, {detail.time}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Phòng</span>
                <span className="font-semibold text-blue-700">{detail.room}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Check-in</span>
                <span className="font-semibold text-slate-900">
                  {detail.checkedInAt}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-blue-700">
                <Monitor size={22} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">Trạng thái gửi lên</h3>
                <p className="text-sm text-slate-500">
                  Điểm danh và tình trạng máy sinh viên đang dùng
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Điểm danh</span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                    attendanceStatusStyles[detail.attendanceStatus]
                  }`}
                >
                  {detail.attendanceStatus}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Máy</span>
                <span className="font-semibold text-blue-700">
                  {detail.computerCode} - {detail.computerName}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Tình trạng máy</span>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                    computerStatusStyles[detail.computerStatus]
                  }`}
                >
                  {detail.computerStatus}
                </span>
              </div>
              <div>
                <p className="text-slate-500">Ghi chú</p>
                <p className="mt-2 rounded-lg bg-slate-50 px-4 py-3 font-medium text-slate-800">
                  {detail.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
