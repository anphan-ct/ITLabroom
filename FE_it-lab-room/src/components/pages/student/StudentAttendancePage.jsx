import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, ClipboardCheck, Smartphone } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import { schedules } from "../../../data/mockData";
import { filterByCurrentStudentClass } from "../../../helpers/student-class.helper";

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
    checkedInAt: "07:05",
  },
  3: {
    status: "Chưa điểm danh",
    computerCode: "",
    checkedInAt: "",
  },
};

function getAttendanceState(scheduleId) {
  return attendanceStates[scheduleId] || {
    status: "Chưa có dữ liệu",
    computerCode: "",
    checkedInAt: "",
  };
}

export default function StudentAttendancePage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const studentSchedules = filterByCurrentStudentClass(schedules).map((schedule) => ({
    ...schedule,
    studyDate: schedule.studyDate || scheduleStudyDates[schedule.id] || "-",
    attendance: getAttendanceState(schedule.id),
  }));

  const subjects = useMemo(() => {
    const subjectMap = new Map();

    studentSchedules.forEach((schedule) => {
      const currentSubject = subjectMap.get(schedule.subject) || {
        subject: schedule.subject,
        className: schedule.className,
        teacher: schedule.teacher,
        roomNames: new Set(),
        totalSessions: 0,
        checkedInSessions: 0,
      };

      currentSubject.roomNames.add(schedule.room);
      currentSubject.totalSessions += 1;
      currentSubject.checkedInSessions += schedule.attendance.checkedInAt ? 1 : 0;
      subjectMap.set(schedule.subject, currentSubject);
    });

    return Array.from(subjectMap.values()).map((subject) => ({
      ...subject,
      roomNames: Array.from(subject.roomNames).join(", "),
    }));
  }, [studentSchedules]);

  const selectedSubjectInfo = subjects.find((subject) => subject.subject === selectedSubject);
  const selectedSubjectSchedules = studentSchedules.filter((schedule) => schedule.subject === selectedSubject);

  return (
    <AppShell
      role="student"
      title="Điểm danh buổi học"
      subtitle="Chọn môn học, xem các buổi và trạng thái điểm danh từ ứng dụng di động"
    >
      <SectionCard
        title={selectedSubjectInfo ? `Các buổi học - ${selectedSubjectInfo.subject}` : "Môn học của bạn"}
        rightAction={
          selectedSubjectInfo ? (
            <button
              type="button"
              onClick={() => setSelectedSubject("")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
          ) : null
        }
      >

        {!selectedSubjectInfo ? (
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Môn học</th>
                  <th className="px-4 py-3 text-left">Lớp</th>
                  <th className="px-4 py-3 text-left">Phòng</th>
                  <th className="px-4 py-3 text-left">Giảng viên</th>
                  <th className="px-4 py-3 text-left">Điểm danh</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {subjects.map((subject) => (
                  <tr key={subject.subject} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <BookOpen size={18} />
                        </span>
                        <span className="font-bold text-slate-900">{subject.subject}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {subject.className}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                      {subject.roomNames}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {subject.teacher}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {subject.checkedInSessions}/{subject.totalSessions} buổi
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubject(subject.subject)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <CalendarDays size={16} />
                        Xem buổi học
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subjects.length === 0 ? (
              <div className="bg-white px-4 py-10 text-center text-sm text-slate-500">
                Chưa có môn học điểm danh cho lớp của bạn.
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Lớp</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedSubjectInfo.className}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Phòng</p>
                <p className="mt-1 font-semibold text-blue-700">{selectedSubjectInfo.roomNames}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Số buổi</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedSubjectSchedules.length} buổi</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Ngày học</th>
                    <th className="px-4 py-3 text-left">Thứ/Ca</th>
                    <th className="px-4 py-3 text-left">Phòng</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Máy</th>
                    <th className="px-4 py-3 text-left">Check-in</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selectedSubjectSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {schedule.studyDate}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {schedule.day}, {schedule.time}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                        {schedule.room}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge value={schedule.attendance.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                        {schedule.attendance.computerCode || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {schedule.attendance.checkedInAt || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <Link
                          to={`/student/attendance/${schedule.id}`}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <ClipboardCheck size={16} />
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </SectionCard>
    </AppShell>
  );
}
