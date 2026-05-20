import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Monitor,
} from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { rooms, schedules, subjects } from "../../../data/mockData";

const shifts = [
  { id: 1, name: "Ca sáng", time: "06:30 - 11:25" },
  { id: 2, name: "Ca chiều", time: "12:30 - 17:30" },
];

const weekdays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"];

const pendingBookings = [
  {
    id: 1,
    room: "PM02",
    day: "Thứ 2",
    shiftId: 1,
    subject: "Mạng máy tính",
    status: "Chờ duyệt",
  },
];

const bookingRequests = [
  {
    id: 1,
    room: "PM01",
    date: "12/05/2026",
    day: "Thứ 2",
    shift: "Ca sáng",
    time: "06:30 - 11:25",
    subject: "Lập trình web",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    room: "PM02",
    date: "13/05/2026",
    day: "Thứ 3",
    shift: "Ca chiều",
    time: "12:30 - 17:30",
    subject: "Cơ sở dữ liệu",
    status: "Đã duyệt",
  },
  {
    id: 3,
    room: "PM03",
    date: "14/05/2026",
    day: "Thứ 4",
    shift: "Ca sáng",
    time: "06:30 - 11:25",
    subject: "Mạng máy tính",
    status: "Từ chối",
  },
];

const statusStyles = {
  "Trống": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Đã sử dụng": "border-amber-200 bg-amber-50 text-amber-700",
  "Đã đăng ký": "border-blue-200 bg-blue-50 text-blue-700",
  "Bảo trì": "border-slate-200 bg-slate-100 text-slate-500",
};

const requestStatusStyles = {
  "Chờ duyệt": "border-amber-200 bg-amber-50 text-amber-700",
  "Đã duyệt": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Từ chối": "border-rose-200 bg-rose-50 text-rose-700",
};

export default function RoomBookingPage() {
  const [activeView, setActiveView] = useState("booking");
  const [selectedDay, setSelectedDay] = useState(weekdays[0]);
  const [selectedShiftId, setSelectedShiftId] = useState(shifts[0].id);
  const [selectedRoomCode, setSelectedRoomCode] = useState("");

  const selectedShift = useMemo(() => {
    return shifts.find((shift) => shift.id === Number(selectedShiftId));
  }, [selectedShiftId]);

  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.code === selectedRoomCode);
  }, [selectedRoomCode]);

  const roomStatuses = useMemo(() => {
    return rooms.map((room) => {
      const usedSchedule = schedules.find(
        (item) =>
          item.room === room.code &&
          item.day === selectedDay &&
          item.time === selectedShift?.time,
      );

      const pendingBooking = pendingBookings.find(
        (item) =>
          item.room === room.code &&
          item.day === selectedDay &&
          item.shiftId === Number(selectedShiftId),
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
          ? `${usedSchedule.subject} - ${usedSchedule.className}`
          : pendingBooking
            ? `${pendingBooking.subject} - ${pendingBooking.status}`
            : "Có thể đăng ký",
      };
    });
  }, [selectedDay, selectedShift, selectedShiftId]);

  const handleTimeChange = (setter) => (event) => {
    setter(event.target.value);
    setSelectedRoomCode("");
  };

  const handleRegisterRoom = (roomCode) => {
    setSelectedRoomCode(roomCode);
  };

  return (
    <AppShell
      role="teacher"
      title="Đăng ký sử dụng phòng"
      subtitle="Chọn ngày và ca học để xem phòng còn trống trước khi đăng ký"
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
                    <th className="px-4 py-3 text-left">Ngày</th>
                    <th className="px-4 py-3 text-left">Ca</th>
                    <th className="px-4 py-3 text-left">Môn học</th>
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
                        {request.date} - {request.day}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {request.shift} ({request.time})
                      </td>
                      <td className="px-4 py-3 text-slate-700">{request.subject}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                            requestStatusStyles[request.status]
                          }`}
                        >
                          {request.status}
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
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ngày học</span>
              <select
                value={selectedDay}
                onChange={handleTimeChange(setSelectedDay)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                {weekdays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ca học</span>
              <select
                value={selectedShiftId}
                onChange={handleTimeChange(setSelectedShiftId)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none"
              >
                {shifts.map((shift) => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name} - {shift.time}
                  </option>
                ))}
              </select>
            </label>
          </div>
            </SectionCard>

            <SectionCard
          title={`Danh sách phòng ${selectedDay}, ${selectedShift?.name || ""}`}
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
                          disabled={!isAvailable}
                          onClick={() => handleRegisterRoom(room.code)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                            isAvailable
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
                value={`${selectedDay}, ${selectedShift?.name || ""} (${selectedShift?.time || ""})`}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
              />
              <select className="rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none">
                <option value="">Chọn môn học</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="rounded-lg border border-slate-200 px-4 py-3 outline-none"
              />
              <textarea
                className="min-h-[120px] rounded-lg border border-slate-200 px-4 py-3 outline-none md:col-span-2"
                placeholder="Mục đích sử dụng phòng"
              />
              <button
                type="button"
                className="w-fit rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
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
