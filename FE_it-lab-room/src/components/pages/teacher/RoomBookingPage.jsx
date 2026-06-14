import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Monitor,
} from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { rooms, schedules, shifts, subjects } from "../../../data/mockData";

const timeSettings = [
  { id: 1, name: "Học kỳ 2 - 2025/2026" },
  { id: 2, name: "Học kỳ hè - 2025/2026" },
];

const lessonRanges = {
  1: { min: 1, max: 6 },
  2: { min: 7, max: 12 },
};

const pendingBookings = [
  {
    id: 1,
    roomId: 2,
    room: "PM02",
    subjectId: 3,
    subject: "Mạng máy tính",
    bookingDate: "2026-05-11",
    shiftId: 1,
    lessonStart: 4,
    lessonEnd: 6,
    approvalStatus: "pending",
  },
];

const bookingRequests = [
  {
    id: 1,
    roomId: 1,
    room: "PM01",
    subjectId: 1,
    subject: "Lập trình web",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-11",
    shiftId: 1,
    shift: "Ca sáng",
    lessonStart: 1,
    lessonEnd: 3,
    purpose: "Dạy thực hành lập trình web",
    approvalStatus: "pending",
  },
  {
    id: 2,
    roomId: 2,
    room: "PM02",
    subjectId: 2,
    subject: "Cơ sở dữ liệu",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-12",
    shiftId: 2,
    shift: "Ca chiều",
    lessonStart: 7,
    lessonEnd: 9,
    purpose: "Thực hành truy vấn SQL",
    approvalStatus: "approved",
  },
  {
    id: 3,
    roomId: 3,
    room: "PM03",
    subjectId: 3,
    subject: "Mạng máy tính",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-13",
    shiftId: 1,
    shift: "Ca sáng",
    lessonStart: 4,
    lessonEnd: 6,
    purpose: "Thực hành cấu hình mạng",
    approvalStatus: "rejected",
  },
];

const statusStyles = {
  "Trống": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đã sử dụng": "border-amber-200 bg-amber-50 text-amber-700",
  "Đã đăng ký": "border-blue-200 bg-blue-50 text-blue-700",
  "Bảo trì": "border-slate-200 bg-slate-100 text-slate-500",
};

const requestStatusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const requestStatusLabels = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const dayLabels = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function parseDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN").format(parseDate(date));
}

function getDayLabel(date) {
  return dayLabels[parseDate(date).getDay()];
}

function hasLessonOverlap(firstStart, firstEnd, secondStart, secondEnd) {
  return Number(firstStart) <= Number(secondEnd) && Number(secondStart) <= Number(firstEnd);
}

export default function RoomBookingPage() {
  const [activeView, setActiveView] = useState("booking");
  const [bookingDate, setBookingDate] = useState("2026-05-11");
  const [selectedShiftId, setSelectedShiftId] = useState(shifts[0].id);
  const [lessonStart, setLessonStart] = useState(1);
  const [lessonEnd, setLessonEnd] = useState(3);
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTimeSettingId, setSelectedTimeSettingId] = useState(timeSettings[0].id);
  const [purpose, setPurpose] = useState("");

  const selectedShift = useMemo(() => {
    return shifts.find((shift) => shift.id === Number(selectedShiftId));
  }, [selectedShiftId]);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.code === selectedRoomCode);
  }, [selectedRoomCode]);

  const selectedSubject = useMemo(() => {
    return subjects.find((subject) => subject.id === Number(selectedSubjectId));
  }, [selectedSubjectId]);

  const selectedTimeSetting = useMemo(() => {
    return timeSettings.find((setting) => setting.id === Number(selectedTimeSettingId));
  }, [selectedTimeSettingId]);

  const bookingDayLabel = useMemo(() => {
    return getDayLabel(bookingDate);
  }, [bookingDate]);

  const selectedLessonRange = useMemo(() => {
    return lessonRanges[Number(selectedShiftId)] || { min: 1, max: 12 };
  }, [selectedShiftId]);

  const invalidLessonRange = useMemo(() => {
    return Number(lessonStart) > Number(lessonEnd)
      || Number(lessonStart) < selectedLessonRange.min
      || Number(lessonEnd) > selectedLessonRange.max;
  }, [lessonEnd, lessonStart, selectedLessonRange]);

  const roomStatuses = useMemo(() => {
    return rooms.map((room) => {
      const usedSchedule = schedules.find(
        (item) =>
          item.room === room.code &&
          item.day === bookingDayLabel &&
          item.shift === selectedShift?.name &&
          hasLessonOverlap(item.lessonStart, item.lessonEnd, lessonStart, lessonEnd),
      );

      const pendingBooking = pendingBookings.find(
        (item) =>
          item.room === room.code &&
          item.bookingDate === bookingDate &&
          item.shiftId === Number(selectedShiftId) &&
          hasLessonOverlap(item.lessonStart, item.lessonEnd, lessonStart, lessonEnd),
      );

      const status =
        room.status === "Bảo trì"
          ? "Bảo trì"
          : usedSchedule
            ? "Đã sử dụng"
            : pendingBooking
              ? "Đã đăng ký"
              : "Trống";

      return {
        ...room,
        status,
        currentUse: usedSchedule
          ? `${usedSchedule.subject} - ${usedSchedule.className} - Tiết ${usedSchedule.lessonStart}-${usedSchedule.lessonEnd}`
          : pendingBooking
            ? `${pendingBooking.subject} - Tiết ${pendingBooking.lessonStart}-${pendingBooking.lessonEnd} - ${pendingBooking.status}`
            : "Có thể đăng ký",
      };
    });
  }, [bookingDate, bookingDayLabel, lessonEnd, lessonStart, selectedShift, selectedShiftId]);

  const handleTimeChange = (setter) => (event) => {
    setter(event.target.value);
    setSelectedRoomCode("");
  };

  const handleShiftChange = (event) => {
    const nextShiftId = event.target.value;
    const nextRange = lessonRanges[Number(nextShiftId)] || { min: 1, max: 12 };

    setSelectedShiftId(nextShiftId);
    setLessonStart(nextRange.min);
    setLessonEnd(nextRange.max);
    setSelectedRoomCode("");
  };

  const handleLessonChange = (setter) => (event) => {
    setter(Number(event.target.value));
    setSelectedRoomCode("");
  };

  const handleRegisterRoom = (roomCode) => {
    if (invalidLessonRange) {
      return;
    }

    setSelectedRoomCode(roomCode);
  };

  return (
      <AppShell
      role="teacher"
      title="Đăng ký sử dụng phòng"
      subtitle="Chọn ngày, ca học và khoảng tiết để xem phòng còn trống trước khi đăng ký"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveView("booking")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              activeView === "booking"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CalendarCheck size={16} />
            Đăng ký phòng
          </button>
          <button
            type="button"
            onClick={() => setActiveView("requests")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              activeView === "requests"
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ClipboardList size={16} />
            Phòng đã đăng ký
          </button>
        </div>

        {activeView === "requests" ? (
          <SectionCard
            title="Danh sách đăng ký phòng đã gửi"
            rightAction={
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <ClipboardList size={16} />
                {bookingRequests.length} yêu cầu
              </span>
            }
          >
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Phòng</th>
                    <th className="px-4 py-3 text-left">Ngày đặt</th>
                    <th className="px-4 py-3 text-left">Ca</th>
                    <th className="px-4 py-3 text-left">Tiết</th>
                    <th className="px-4 py-3 text-left">Môn học</th>
                    <th className="px-4 py-3 text-left">Mục đích</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-900">
                        {request.room}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {formatDate(request.bookingDate)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {request.shift}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        Tiết {request.lessonStart} - {request.lessonEnd}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{request.subject}</td>
                      <td className="max-w-[260px] px-4 py-3 text-slate-700">{request.purpose}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                            requestStatusStyles[request.approvalStatus]
                          }`}
                        >
                          {requestStatusLabels[request.approvalStatus]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        ) : (
          <>
            <SectionCard title="Kiểm tra phòng trống">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ngày đặt</span>
              <input
                type="date"
                value={bookingDate}
                onChange={handleTimeChange(setBookingDate)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Cài đặt thời gian</span>
              <select
                value={selectedTimeSettingId}
                onChange={handleTimeChange(setSelectedTimeSettingId)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                {timeSettings.map((setting) => (
                  <option key={setting.id} value={setting.id}>
                    {setting.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ca học</span>
              <select
                value={selectedShiftId}
                onChange={handleShiftChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} - {shift.time}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tiết bắt đầu</span>
              <input
                type="number"
                min={selectedLessonRange.min}
                max={selectedLessonRange.max}
                value={lessonStart}
                onChange={handleLessonChange(setLessonStart)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tiết kết thúc</span>
              <input
                type="number"
                min={selectedLessonRange.min}
                max={selectedLessonRange.max}
                value={lessonEnd}
                onChange={handleLessonChange(setLessonEnd)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              />
            </label>
          </div>
          {invalidLessonRange ? (
            <p className="mt-3 text-sm font-semibold text-rose-600">
              Khoảng tiết không hợp lệ với ca học đã chọn.
            </p>
          ) : null}
            </SectionCard>

            <SectionCard
          title={`Danh sách phòng ngày ${formatDate(bookingDate)}, ${selectedShift?.name || ""}, tiết ${lessonStart}-${lessonEnd}`}
          rightAction={
            selectedRoomCode ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} />
                Đã chọn {selectedRoomCode}
              </span>
            ) : null
          }
        >
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Phòng</th>
                  <th className="px-4 py-3 text-left">Số máy</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Chi tiết</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {roomStatuses.map((room) => {
                  const isAvailable = room.status === "Trống";
                  const isSelected = room.code === selectedRoomCode;

                  return (
                    <tr
                      key={room.id}
                      className={`border-t border-slate-100 ${
                        isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                            <Monitor size={18} />
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{room.code}</p>
                            <p className="text-xs text-slate-500">{room.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {room.computers} máy
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                            statusStyles[room.status]
                          }`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{room.currentUse}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={!isAvailable || invalidLessonRange}
                          onClick={() => handleRegisterRoom(room.code)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                            isAvailable && !invalidLessonRange
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "cursor-not-allowed bg-slate-100 text-slate-400"
                          }`}
                        >
                          <CalendarCheck size={16} />
                          Đăng ký phòng
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
            </SectionCard>

            {selectedRoomCode ? (
              <SectionCard
            title="Thông tin đăng ký"
            rightAction={
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <ClipboardList size={16} />
                Chờ admin duyệt sau khi gửi
              </span>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                readOnly
                value={`${selectedRoomCode} - ${selectedRoom?.name || ""}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
              />
              <input
                readOnly
                value={`${formatDate(bookingDate)}, ${selectedShift?.name || ""}, tiết ${lessonStart}-${lessonEnd}`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
              />
              <select
                value={selectedSubjectId}
                onChange={(event) => setSelectedSubjectId(event.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                <option value="">Chọn môn học</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <input
                readOnly
                value={selectedTimeSetting?.name || ""}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
              />
              <textarea
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="min-h-[120px] rounded-lg border border-slate-200 px-4 py-3 outline-none md:col-span-2"
                placeholder="Mục đích sử dụng phòng"
              />
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2">
                Dữ liệu gửi: phòng {selectedRoom?.id || "-"}, môn {selectedSubject?.id || "-"}, cài đặt thời gian {selectedTimeSetting?.id || "-"}, ngày {bookingDate}, ca {selectedShift?.id || "-"}, tiết {lessonStart}-{lessonEnd}.
              </div>
              <button
                type="button"
                disabled={!selectedSubjectId || !purpose.trim()}
                className="w-fit rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              >
                Gửi đăng ký
              </button>
            </div>
              </SectionCard>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
