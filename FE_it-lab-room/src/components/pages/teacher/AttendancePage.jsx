import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  MonitorCheck,
  Users,
} from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import { classes, schedules } from "../../../data/mockData";

const initialAttendanceSessions = [
  {
    id: 1,
    scheduleId: 1,
    checkedInCount: 2,
  },
  {
    id: 2,
    scheduleId: 2,
    checkedInCount: 34,
  },
];

const scheduleStudyDates = {
  1: "10/06/2026",
  2: "12/06/2026",
  3: "17/06/2026",
  4: "19/06/2026",
};

export default function AttendancePage() {
  const [selectedCourseKey, setSelectedCourseKey] = useState("");
  const attendanceSessions = initialAttendanceSessions;

  const classSessions = useMemo(() => {
    return schedules.map((schedule) => {
      const classInfo = classes.find((item) => item.code === schedule.className);
      const attendanceSession = attendanceSessions.find((item) => item.scheduleId === schedule.id);

      return {
        ...schedule,
        studyDate: schedule.studyDate || scheduleStudyDates[schedule.id] || "-",
        attendanceSession,
        classSize: classInfo?.size || 0,
        attendanceStatus: attendanceSession ? "Có dữ liệu" : "Chưa có dữ liệu",
      };
    });
  }, []);
  const attendanceRows = classSessions;
  const teachingCourses = useMemo(() => {
    const courseMap = new Map();

    classSessions.forEach((session) => {
      const key = `${session.subject}-${session.className}`;
      const currentCourse = courseMap.get(key) || {
        key,
        subject: session.subject,
        className: session.className,
        teacher: session.teacher,
        classSize: session.classSize,
        roomNames: new Set(),
        scheduleCount: 0,
        attendanceCount: 0,
      };

      currentCourse.roomNames.add(session.room);
      currentCourse.scheduleCount += 1;
      currentCourse.attendanceCount += session.attendanceSession?.checkedInCount ? 1 : 0;
      courseMap.set(key, currentCourse);
    });

    return Array.from(courseMap.values()).map((course) => ({
      ...course,
      roomNames: Array.from(course.roomNames).join(", "),
    }));
  }, [classSessions]);
  const selectedCourse = teachingCourses.find((course) => course.key === selectedCourseKey);
  const selectedCourseAttendanceRows = attendanceRows.filter((session) => {
    return `${session.subject}-${session.className}` === selectedCourseKey;
  });

  return (
    <AppShell
      role="teacher"
      title="Quản lý điểm danh"
      subtitle="Xem điểm danh theo môn, buổi học và sinh viên đã quét QR máy"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ClipboardCheck size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Buổi học</p>
              <p className="text-xl font-bold text-slate-900">{attendanceRows.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ClipboardCheck size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Có điểm danh</p>
              <p className="text-xl font-bold text-slate-900">
                {attendanceSessions.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <MonitorCheck size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Đã quét QR</p>
              <p className="text-xl font-bold text-slate-900">
                {attendanceSessions.reduce((total, item) => total + item.checkedInCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {!selectedCourse ? (
          <SectionCard title="Môn/lớp đang giảng dạy">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Môn học</th>
                    <th className="px-4 py-3 text-left">Lớp</th>
                    <th className="px-4 py-3 text-left">Phòng</th>
                    <th className="px-4 py-3 text-left">Sĩ số</th>
                    <th className="px-4 py-3 text-left">Buổi điểm danh</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {teachingCourses.map((course) => (
                    <tr key={course.key} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            <BookOpen size={18} />
                          </span>
                          <span className="font-bold text-slate-900">{course.subject}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                        {course.className}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                        {course.roomNames}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {course.classSize} sinh viên
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {course.attendanceCount}/{course.scheduleCount} buổi có dữ liệu
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCourseKey(course.key)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <ClipboardCheck size={16} />
                          Xem buổi điểm danh
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
            title={`Buổi điểm danh - ${selectedCourse.subject}`}
            rightAction={
              <button
                type="button"
                onClick={() => setSelectedCourseKey("")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft size={16} />
                Quay lại
              </button>
            }
          >
            <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Lớp</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedCourse.className}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Phòng</p>
                <p className="mt-1 font-semibold text-blue-700">{selectedCourse.roomNames}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Buổi học</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedCourseAttendanceRows.length} buổi</p>
              </div>
            </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Lớp</th>
                  <th className="px-4 py-3 text-left">Môn học</th>
                  <th className="px-4 py-3 text-left">Ngày học</th>
                  <th className="px-4 py-3 text-left">Thứ/Ca</th>
                  <th className="px-4 py-3 text-left">Phòng</th>
                  <th className="px-4 py-3 text-left">Sĩ số</th>
                <th className="px-4 py-3 text-left">Dữ liệu điểm danh</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {selectedCourseAttendanceRows.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                          <Users size={18} />
                        </span>
                        <span className="font-bold text-slate-900">{session.className}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{session.subject}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {session.studyDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {session.day}, {session.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">{session.room}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {session.classSize} sinh viên
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge value={session.attendanceStatus} />
                        <span className="text-xs text-slate-500">
                          {session.attendanceSession?.checkedInCount || 0}/{session.classSize} đã quét
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {session.attendanceSession ? (
                          <Link
                            to={`/teacher/attendance/sessions/${session.attendanceSession.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Users size={16} />
                            Xem buổi
                          </Link>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-400"
                          >
                            <Users size={16} />
                            Xem buổi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedCourseAttendanceRows.length === 0 ? (
              <div className="bg-white px-4 py-10 text-center text-sm text-slate-500">
                Môn/lớp này chưa có buổi học nào.
              </div>
            ) : null}
          </div>
          </SectionCard>
        )}
      </div>
    </AppShell>
  );
}
