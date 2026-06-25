import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, MonitorCheck, Users } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";

const attendanceSessions = [
  {
    id: 1,
    title: "Điểm danh thực hành Lập trình web",
    className: "CNTT01",
    subject: "Lập trình web",
    day: "Thứ 2",
    time: "07:00 - 09:00",
    room: "PM01",
  },
  {
    id: 2,
    title: "Điểm danh thực hành Cơ sở dữ liệu",
    className: "CNTT02",
    subject: "Cơ sở dữ liệu",
    day: "Thứ 3",
    time: "12:30 - 17:30",
    room: "PM02",
  },
];

const studentAttendanceResults = [
  {
    id: 1,
    sessionId: 1,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    checkedInAt: "07:05",
    attendanceStatus: "Có mặt",
    computerCode: "PC001",
    computerName: "Máy 01",
  },
  {
    id: 2,
    sessionId: 1,
    studentId: "SV002",
    studentName: "Trần Thị Lan",
    checkedInAt: "07:15",
    attendanceStatus: "Đi trễ",
    computerCode: "PC002",
    computerName: "Máy 02",
  },
  {
    id: 3,
    sessionId: 1,
    studentId: "SV003",
    studentName: "Lê Quốc Huy",
    checkedInAt: "",
    attendanceStatus: "Chưa điểm danh",
    computerCode: "",
    computerName: "",
  },
  {
    id: 4,
    sessionId: 1,
    studentId: "SV004",
    studentName: "Phạm Minh Đức",
    checkedInAt: "",
    attendanceStatus: "Chưa điểm danh",
    computerCode: "",
    computerName: "",
  },
  {
    id: 5,
    sessionId: 2,
    studentId: "SV005",
    studentName: "Hoàng Minh Quân",
    checkedInAt: "13:04",
    attendanceStatus: "Có mặt",
    computerCode: "PC015",
    computerName: "Máy 15",
  },
  {
    id: 6,
    sessionId: 2,
    studentId: "SV006",
    studentName: "Ngô Thảo Vy",
    checkedInAt: "",
    attendanceStatus: "Chưa điểm danh",
    computerCode: "",
    computerName: "",
  },
];

export default function TeacherAttendanceSessionStatusPage() {
  const { sessionId } = useParams();
  const session = attendanceSessions.find((item) => String(item.id) === sessionId);

  if (!session) {
    return <Navigate to="/teacher/attendance" replace />;
  }

  const studentResults = studentAttendanceResults.filter(
    (result) => String(result.sessionId) === sessionId,
  );
  const checkedInStudents = studentResults.filter((item) => item.checkedInAt);
  const absentStudents = studentResults.filter((item) => !item.checkedInAt);
  const dataStatus = checkedInStudents.length > 0 ? "Có dữ liệu" : "Chưa có dữ liệu";

  return (
    <AppShell
      role="teacher"
      title="Theo dõi điểm danh"
      subtitle="Danh sách sinh viên được cập nhật khi mobile quét QR máy"
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

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Users className="text-blue-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Sĩ số</p>
                <p className="text-xl font-bold text-slate-900">{studentResults.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Đã điểm danh</p>
                <p className="text-xl font-bold text-slate-900">{checkedInStudents.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Clock3 className="text-amber-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Chưa quét</p>
                <p className="text-xl font-bold text-slate-900">{absentStudents.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <MonitorCheck className="text-blue-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Máy đã gán</p>
                <p className="text-xl font-bold text-slate-900">{checkedInStudents.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Danh sách sinh viên điểm danh</h3>
          <StatusBadge value={dataStatus} />
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Mã SV</th>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Máy quét</th>
                <th className="px-4 py-3 text-left">Tên máy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {studentResults.map((result) => (
                <tr key={result.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {result.studentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    <Link
                      to={`/teacher/attendance/sessions/${sessionId}/students/${result.studentId}`}
                      className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {result.studentName}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {result.checkedInAt || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge value={result.attendanceStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {result.computerCode || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {result.computerName || "-"}
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
