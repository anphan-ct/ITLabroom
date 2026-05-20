import { Link } from "react-router-dom";
import { ClipboardCheck, History } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { schedules } from "../../../data/mockData";

export default function StudentAttendancePage() {
  return (
    <AppShell
      role="student"
      title="Điểm danh buổi học"
      subtitle="Chọn môn học để xác nhận điểm danh và tình trạng máy"
    >
      <SectionCard title="Danh sách môn học hôm nay">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Môn học</th>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Ngày/Ca</th>
                <th className="px-4 py-3 text-left">Phòng</th>
                <th className="px-4 py-3 text-left">Giảng viên</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                    {schedule.subject}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {schedule.className}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {schedule.day}, {schedule.time}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {schedule.room}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {schedule.teacher}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/student/attendance/${schedule.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <ClipboardCheck size={16} />
                        Xem điểm danh
                      </Link>
                      <Link
                        to={`/student/attendance/history/${schedule.className}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <History size={16} />
                        Lịch sử
                      </Link>
                    </div>
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
