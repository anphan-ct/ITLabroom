import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, Users } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { classes, schedules } from "../../../data/mockData";

const createdAttendanceSessions = [
  {
    id: 1,
    scheduleId: 1,
    title: "Điểm danh buổi thực hành",
    openedAt: "07:00",
    status: "Đang mở",
  },
];

const sessionStatusStyles = {
  "Đang mở": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đã đóng": "border-slate-200 bg-slate-100 text-slate-600",
};

export default function AttendancePage() {
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  const classSessions = useMemo(() => {
    return schedules.map((schedule) => {
      const classInfo = classes.find((item) => item.code === schedule.className);

      return {
        ...schedule,
        classSize: classInfo?.size || 0,
      };
    });
  }, []);

  const selectedSession = classSessions.find(
    (item) => item.id === selectedScheduleId,
  );

  const teacherSessions = selectedSession
    ? createdAttendanceSessions.filter(
        (session) => session.scheduleId === selectedSession.id,
      )
    : [];

  const handleBackToClasses = () => {
    setSelectedScheduleId(null);
  };

  const handleScheduleSelect = (scheduleId) => {
    setSelectedScheduleId(scheduleId);
  };

  return (
    <AppShell
      role="teacher"
      title="Tạo điểm danh"
      subtitle="Giảng viên chỉ tạo phiên điểm danh, sinh viên tự xác nhận"
    >
      {!selectedSession ? (
        <SectionCard title="Danh sách lớp/buổi học">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Lớp</th>
                  <th className="px-4 py-3 text-left">Môn học</th>
                  <th className="px-4 py-3 text-left">Ngày/Ca</th>
                  <th className="px-4 py-3 text-left">Phòng</th>
                  <th className="px-4 py-3 text-left">Sĩ số</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {classSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                            <Users size={18} />
                          </span>
                          <span className="font-bold text-slate-900">
                            {session.className}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {session.subject}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {session.day}, {session.time}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                        {session.room}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {session.classSize} sinh viên
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleScheduleSelect(session.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <ClipboardCheck size={16} />
                          Tạo điểm danh
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard
          title={`Phiên điểm danh - ${selectedSession.className}`}
          rightAction={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBackToClasses}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Tạo phiên
              </button>
            </div>
          }
        >
          <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-slate-500">Môn học</p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedSession.subject}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-slate-500">Buổi học</p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedSession.day}, {selectedSession.time}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-slate-500">Phòng</p>
              <p className="mt-1 font-semibold text-slate-900">
                {selectedSession.room}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Phiên điểm danh</th>
                  <th className="px-4 py-3 text-left">Mở lúc</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {teacherSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {session.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {session.openedAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                          sessionStatusStyles[session.status]
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        to={`/teacher/attendance/sessions/${session.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <Users size={16} />
                        Xem trạng thái
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </AppShell>
  );
}
