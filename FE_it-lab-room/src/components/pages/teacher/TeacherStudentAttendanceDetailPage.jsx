import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Monitor, UserRound } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";

const studentAttendanceHistories = [
  {
    id: 1,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    className: "CNTT01",
    subject: "Lập trình web",
    studyDate: "10/06/2026",
    day: "Thứ 2",
    shift: "Ca sáng",
    lessonRange: "Tiết 1 - 3",
    room: "PM01",
    checkedInAt: "07:05",
    attendanceStatus: "Có mặt",
    computerCode: "PC001",
    computerName: "Máy 01",
    note: "",
  },
  {
    id: 2,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    className: "CNTT01",
    subject: "Cơ sở dữ liệu",
    studyDate: "12/06/2026",
    day: "Thứ 4",
    shift: "Ca chiều",
    lessonRange: "Tiết 7 - 9",
    room: "PM02",
    checkedInAt: "13:04",
    attendanceStatus: "Có mặt",
    computerCode: "PC015",
    computerName: "Máy 15",
    note: "",
  },
  {
    id: 3,
    studentId: "SV001",
    studentName: "Nguyễn Văn Nam",
    className: "CNTT01",
    subject: "Mạng máy tính",
    studyDate: "17/06/2026",
    day: "Thứ 2",
    shift: "Ca sáng",
    lessonRange: "Tiết 4 - 6",
    room: "PM01",
    checkedInAt: "",
    attendanceStatus: "Vắng",
    computerCode: "",
    computerName: "",
    note: "Không có bản ghi check-in",
  },
  {
    id: 4,
    studentId: "SV002",
    studentName: "Trần Thị Lan",
    className: "CNTT01",
    subject: "Lập trình web",
    studyDate: "10/06/2026",
    day: "Thứ 2",
    shift: "Ca sáng",
    lessonRange: "Tiết 1 - 3",
    room: "PM01",
    checkedInAt: "07:15",
    attendanceStatus: "Đi trễ",
    computerCode: "PC002",
    computerName: "Máy 02",
    note: "",
  },
  {
    id: 5,
    studentId: "SV005",
    studentName: "Hoàng Minh Quân",
    className: "CNTT02",
    subject: "Cơ sở dữ liệu",
    studyDate: "12/06/2026",
    day: "Thứ 3",
    shift: "Ca chiều",
    lessonRange: "Tiết 7 - 9",
    room: "PM02",
    checkedInAt: "13:04",
    attendanceStatus: "Có mặt",
    computerCode: "PC015",
    computerName: "Máy 15",
    note: "",
  },
  {
    id: 6,
    studentId: "SV006",
    studentName: "Ngô Thảo Vy",
    className: "CNTT02",
    subject: "Cơ sở dữ liệu",
    studyDate: "12/06/2026",
    day: "Thứ 3",
    shift: "Ca chiều",
    lessonRange: "Tiết 7 - 9",
    room: "PM02",
    checkedInAt: "",
    attendanceStatus: "Vắng",
    computerCode: "",
    computerName: "",
    note: "Không có bản ghi check-in",
  },
];

export default function TeacherStudentAttendanceDetailPage() {
  const { sessionId, studentId } = useParams();
  const histories = studentAttendanceHistories.filter((item) => item.studentId === studentId);
  const student = histories[0];
  const backPath = sessionId ? `/teacher/attendance/sessions/${sessionId}` : "/teacher/attendance";

  if (!student) {
    return <Navigate to="/teacher/attendance" replace />;
  }

  const checkedInCount = histories.filter((item) => item.checkedInAt).length;
  const absentCount = histories.filter((item) => !item.checkedInAt).length;
  const latestHistory = histories[0];

  return (
    <AppShell
      role="teacher"
      title="Lịch sử điểm danh sinh viên"
      subtitle="Xem các buổi học sinh viên đã check-in bằng QR máy"
    >
      <SectionCard
        title={student.studentName}
        rightAction={
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserRound size={22} />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{student.studentName}</h3>
                <p className="text-sm text-slate-500">
                  {student.studentId} - {student.className}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Số buổi</span>
                <span className="font-semibold text-slate-900">{histories.length}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Có check-in</span>
                <span className="font-semibold text-emerald-700">{checkedInCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vắng/chưa quét</span>
                <span className="font-semibold text-rose-700">{absentCount}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <CalendarDays className="text-blue-700" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Buổi gần nhất</p>
                  <p className="mt-1 font-bold text-slate-900">{latestHistory.studyDate}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-700" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Tỷ lệ có mặt</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {Math.round((checkedInCount / histories.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <Monitor className="text-blue-700" size={20} />
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Máy gần nhất</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {latestHistory.computerCode || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Ngày học</th>
                <th className="px-4 py-3 text-left">Môn học</th>
                <th className="px-4 py-3 text-left">Phòng</th>
                <th className="px-4 py-3 text-left">Ca/Tiết</th>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Máy</th>
                <th className="px-4 py-3 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {histories.map((history) => (
                <tr key={history.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    <div className="font-semibold text-slate-900">{history.studyDate}</div>
                    <div className="text-xs text-slate-500">{history.day}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {history.subject}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {history.room}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock3 size={15} className="text-slate-400" />
                      <span>{history.shift}</span>
                    </div>
                    <div className="text-xs text-slate-500">{history.lessonRange}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {history.checkedInAt || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge value={history.attendanceStatus} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {history.computerCode ? (
                      <div>
                        <div className="font-semibold text-blue-700">{history.computerCode}</div>
                        <div className="text-xs text-slate-500">{history.computerName}</div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="min-w-[180px] px-4 py-3 text-slate-700">
                    {history.note || "-"}
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
