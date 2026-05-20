import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";

const attendanceSessions = [
  {
    id: 1,
    title: "Điểm danh buổi thực hành",
    className: "CNTT01",
    subject: "Lập trình web",
    day: "Thứ 2",
    time: "07:00 - 09:00",
    room: "PM01",
  },
];

const studentAttendanceResults = [
  {
    id: 1,
    sessionId: 1,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    className: "CNTT01",
    checkedInAt: "07:05",
    attendanceStatus: "Có mặt",
    computerCode: "PC001",
    computerStatus: "Hoạt động bình thường",
  },
  {
    id: 2,
    sessionId: 1,
    studentId: "SV002",
    studentName: "Trần Thị Lan",
    className: "CNTT01",
    checkedInAt: "07:15",
    attendanceStatus: "Đi trễ",
    computerCode: "PC002",
    computerStatus: "Lỗi nhẹ",
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

export default function TeacherAttendanceSessionStatusPage() {
  const { sessionId } = useParams();
  const session = attendanceSessions.find((item) => String(item.id) === sessionId);

  if (!session) {
    return <Navigate to="/teacher/attendance" replace />;
  }

  const studentResults = studentAttendanceResults.filter(
    (result) => String(result.sessionId) === sessionId,
  );

  return (
    <AppShell
      role="teacher"
      title="Trạng thái sinh viên"
      subtitle="Xem trạng thái sinh viên theo phiên điểm danh"
    >
      <SectionCard
        title={session.title}
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
        <div className="mb-4 grid gap-3 text-sm md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Lớp</p>
            <p className="mt-1 font-semibold text-slate-900">{session.className}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Môn học</p>
            <p className="mt-1 font-semibold text-slate-900">{session.subject}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Buổi học</p>
            <p className="mt-1 font-semibold text-slate-900">
              {session.day}, {session.time}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Phòng</p>
            <p className="mt-1 font-semibold text-slate-900">{session.room}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Mã SV</th>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Điểm danh</th>
                <th className="px-4 py-3 text-left">Máy</th>
                <th className="px-4 py-3 text-left">Tình trạng máy</th>
              </tr>
            </thead>
            <tbody>
              {studentResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {result.studentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    <Link
                      to={`/teacher/attendance/students/${result.studentId}`}
                      className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {result.studentName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {result.className}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {result.checkedInAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        attendanceStatusStyles[result.attendanceStatus]
                      }`}
                    >
                      {result.attendanceStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {result.computerCode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        computerStatusStyles[result.computerStatus]
                      }`}
                    >
                      {result.computerStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}
