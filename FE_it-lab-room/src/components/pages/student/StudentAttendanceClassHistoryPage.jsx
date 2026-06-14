import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { attendanceHistories, classes } from "../../../data/mockData";
import { getCurrentStudentClassCode } from "../../../helpers/student-class.helper";

const statusStyles = {
  "Có mặt": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đi trễ": "border-amber-200 bg-amber-50 text-amber-700",
  "Vắng": "border-rose-200 bg-rose-50 text-rose-700",
};

export default function StudentAttendanceClassHistoryPage() {
  const { classCode } = useParams();
  const studentClassCode = getCurrentStudentClassCode();

  if (!studentClassCode || classCode !== studentClassCode) {
    return <Navigate to="/student/attendance" replace />;
  }

  const classInfo = classes.find((item) => item.code === classCode);

  if (!classInfo) {
    return <Navigate to="/student/attendance" replace />;
  }

  const classAttendanceHistories = attendanceHistories.filter(
    (item) => item.className === classInfo.code,
  );

  return (
    <AppShell
      role="student"
      title="Lịch sử điểm danh"
      subtitle={`Xem lại các buổi học đã điểm danh của lớp ${classInfo.code}`}
    >
      <SectionCard
        title={`Lịch sử điểm danh lớp ${classInfo.code}`}
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
        <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Tên lớp</p>
            <p className="mt-1 font-semibold text-slate-900">{classInfo.name}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Sĩ số</p>
            <p className="mt-1 font-semibold text-slate-900">
              {classInfo.size} sinh viên
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Số buổi</p>
            <p className="mt-1 font-semibold text-slate-900">
              {classAttendanceHistories.length} buổi
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Môn học</th>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Ngày/Ca</th>
                <th className="px-4 py-3 text-left">Phòng</th>
                <th className="px-4 py-3 text-left">Check-in</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {classAttendanceHistories.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {item.subject}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.className}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.day}, {item.time}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {item.room}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.checkedInAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                        statusStyles[item.status]
                      }`}
                    >
                      {item.status}
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
