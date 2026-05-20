import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ClipboardCheck, Monitor, X } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { computers, rooms, schedules, teacherAttendanceSessions } from "../../../data/mockData";

const sessionStatusStyles = {
  "Đang mở": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đã đóng": "border-slate-200 bg-slate-100 text-slate-600",
};

const computerStatusOptions = [
  "Hoạt động bình thường",
  "Lỗi nhẹ",
  "Hỏng",
];

export default function StudentAttendanceDetailPage() {
  const { scheduleId } = useParams();
  const schedule = schedules.find((item) => String(item.id) === scheduleId);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState("Có mặt");
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const [selectedComputerCode, setSelectedComputerCode] = useState("");
  const [computerStatus, setComputerStatus] = useState("Hoạt động bình thường");

  const attendanceSessions = useMemo(() => {
    return teacherAttendanceSessions.filter(
      (session) => String(session.scheduleId) === scheduleId,
    );
  }, [scheduleId]);

  const roomComputers = useMemo(() => {
    if (!selectedRoomCode) {
      return [];
    }

    return computers.filter((computer) => computer.room === selectedRoomCode);
  }, [selectedRoomCode]);

  if (!schedule) {
    return <Navigate to="/student/attendance" replace />;
  }

  const openAttendanceModal = (session) => {
    const defaultRoomCode = schedule.room;
    const defaultRoomComputers = computers.filter((computer) => computer.room === defaultRoomCode);

    setSelectedSession(session);
    setAttendanceStatus("Có mặt");
    setComputerStatus("Hoạt động bình thường");
    setSelectedRoomCode(defaultRoomCode);
    setSelectedComputerCode(defaultRoomComputers[0]?.code || "");
  };

  const handleRoomChange = (event) => {
    const roomCode = event.target.value;
    const nextRoomComputers = computers.filter((computer) => computer.room === roomCode);

    setSelectedRoomCode(roomCode);
    setSelectedComputerCode(nextRoomComputers[0]?.code || "");
  };

  const closeAttendanceModal = () => {
    setSelectedSession(null);
  };

  return (
    <AppShell
      role="student"
      title="Điểm danh môn học"
      subtitle="Xem phiên điểm danh giảng viên đã tạo"
    >
      <SectionCard
        title={`Điểm danh giảng viên đã tạo - ${schedule.subject}`}
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
        <div className="mb-4 grid gap-3 text-sm md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Lớp</p>
            <p className="mt-1 font-semibold text-slate-900">{schedule.className}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Buổi học</p>
            <p className="mt-1 font-semibold text-slate-900">
              {schedule.day}, {schedule.time}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Phòng</p>
            <p className="mt-1 font-semibold text-slate-900">{schedule.room}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-slate-500">Giảng viên</p>
            <p className="mt-1 font-semibold text-slate-900">{schedule.teacher}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Nội dung</th>
                <th className="px-4 py-3 text-left">Buổi học</th>
                <th className="px-4 py-3 text-left">Mở lúc</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSessions.map((session) => (
                <tr
                  key={session.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {session.title}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {schedule.day}, {schedule.time}
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
                    <button
                      type="button"
                      disabled={session.status !== "Đang mở"}
                      onClick={() => openAttendanceModal(session)}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                        session.status === "Đang mở"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ClipboardCheck size={16} />
                      Điểm danh
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {selectedSession ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Điểm danh {schedule.subject}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedSession.title} - {schedule.room}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAttendanceModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <section className="rounded-lg border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <ClipboardCheck className="text-blue-600" size={20} />
                  <h3 className="font-bold text-slate-900">Điểm danh</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-500">Thời gian check-in</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      Tự động theo thời gian hiện tại
                    </p>
                  </div>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Trạng thái
                    </span>
                    <select
                      value={attendanceStatus}
                      onChange={(event) => setAttendanceStatus(event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
                    >
                      <option>Có mặt</option>
                      <option>Đi trễ</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Monitor className="text-blue-600" size={20} />
                  <h3 className="font-bold text-slate-900">Tình trạng máy tính</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Phòng máy
                    </span>
                    <select
                      value={selectedRoomCode}
                      onChange={handleRoomChange}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.code}>
                          {room.code} - {room.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Máy đang dùng
                    </span>
                    <select
                      value={selectedComputerCode}
                      onChange={(event) => setSelectedComputerCode(event.target.value)}
                      disabled={!selectedRoomCode || roomComputers.length === 0}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      {roomComputers.length > 0 ? (
                        roomComputers.map((computer) => (
                          <option key={computer.id} value={computer.code}>
                            {computer.code} - {computer.name}
                          </option>
                        ))
                      ) : (
                        <option value="">Phòng chưa có máy</option>
                      )}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Trạng thái máy
                    </span>
                    <select
                      value={computerStatus}
                      onChange={(event) => setComputerStatus(event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
                    >
                      {computerStatusOptions.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <textarea
                    className="min-h-[110px] rounded-lg border border-slate-200 px-4 py-3 outline-none md:col-span-2"
                    placeholder="Mô tả lỗi nếu có"
                  />
                </div>
              </section>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAttendanceModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={closeAttendanceModal}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <CheckCircle2 size={16} />
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
