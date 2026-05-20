import { useMemo, useState } from "react";
import { AlertTriangle, Monitor, Wrench } from "lucide-react";
import { computers, rooms } from "../../data/mockData";
import StatusBadge from "./StatusBadge";

export default function IncidentForm({
  initialRoomCode = "",
  initialComputerCode = "",
}) {
  const [selectedRoomCode, setSelectedRoomCode] = useState(initialRoomCode);
  const [selectedComputerCode, setSelectedComputerCode] = useState(
    initialComputerCode
  );

  const roomComputers = useMemo(() => {
    return computers.filter((computer) => computer.room === selectedRoomCode);
  }, [selectedRoomCode]);

  const selectedComputer = useMemo(() => {
    return roomComputers.find(
      (computer) => computer.code === selectedComputerCode
    );
  }, [roomComputers, selectedComputerCode]);

  const handleRoomChange = (event) => {
    setSelectedRoomCode(event.target.value);
    setSelectedComputerCode("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">
            Phòng máy
          </span>
          <select
            className="px-4 py-3"
            onChange={handleRoomChange}
            value={selectedRoomCode}
          >
            <option value="">Chọn phòng máy</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.code}>
                {room.name} - {room.location}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Mã máy</span>
          <select
            className="px-4 py-3"
            disabled={!selectedRoomCode}
            onChange={(event) => setSelectedComputerCode(event.target.value)}
            value={selectedComputerCode}
          >
            <option value="">
              {selectedRoomCode ? "Chọn máy trong phòng" : "Chọn phòng trước"}
            </option>
            {roomComputers.map((computer) => (
              <option key={computer.id} value={computer.code}>
                {computer.code} - {computer.name} - {computer.status}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">
            Mô tả sự cố
          </span>
          <textarea
            className="min-h-[140px] px-4 py-3"
            placeholder="Nhập tình trạng lỗi, thời điểm phát hiện, thao tác đã thử..."
          />
        </label>

        <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          <Wrench size={18} />
          Gửi báo cáo
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Thông tin thiết bị</h3>
            <p className="text-sm text-slate-500">
              Dữ liệu được lọc theo phòng máy đã chọn
            </p>
          </div>
        </div>

        {selectedComputer ? (
          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500">Mã máy</span>
              <span className="font-semibold text-slate-900">
                {selectedComputer.code}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500">Tên máy</span>
              <span className="font-semibold text-slate-900">
                {selectedComputer.name}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500">IP</span>
              <span className="font-semibold text-slate-900">
                {selectedComputer.ip}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-slate-500">Cấu hình</span>
              <span className="font-semibold text-slate-900">
                {selectedComputer.cpu}, {selectedComputer.ram}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Trạng thái</span>
              <StatusBadge value={selectedComputer.status} />
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-start gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            <AlertTriangle size={18} className="mt-0.5 text-amber-600" />
            <p>
              Chọn phòng máy rồi chọn mã máy trong phòng đó để hệ thống ghi nhận
              đúng thiết bị cần xử lý.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
