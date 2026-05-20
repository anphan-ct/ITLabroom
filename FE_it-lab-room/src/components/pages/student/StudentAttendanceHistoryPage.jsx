import { Link } from "react-router-dom";
import { ArrowLeft, History, Users } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { attendanceHistories, classes } from "../../../data/mockData";

export default function StudentAttendanceHistoryPage() {
  return (
    <AppShell
      role="student"
      title="Lịch sử điểm danh"
      subtitle="Chọn lớp để xem lịch sử điểm danh"
    >
      <SectionCard
        title="Danh sách lớp"
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
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Tên lớp</th>
                <th className="px-4 py-3 text-left">Sĩ số</th>
                <th className="px-4 py-3 text-left">Số lần điểm danh</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => {
                const totalHistories = attendanceHistories.filter(
                  (item) => item.className === classItem.code,
                ).length;

                return (
                  <tr
                    key={classItem.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                          <Users size={18} />
                        </span>
                        <span className="font-bold text-slate-900">
                          {classItem.code}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {classItem.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {classItem.size} sinh viên
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {totalHistories} buổi
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        to={`/student/attendance/history/${classItem.code}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <History size={16} />
                        Xem lịch sử
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}
