import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getComputers, upsertComputer } from "../../../data/computersStore";
import { getRooms } from "../../../data/roomsStore";

const statuses = ["Hoạt động", "Hỏng", "Bảo trì"];

const initialForm = {
  code: "",
  name: "",
  room: "",
  position: "",
  qrCode: "",
  cpu: "",
  ram: "",
  gpu: "",
  mainboard: "",
  monitor: "",
  keyboard: "",
  mouse: "",
  hdd: "",
  ssd: "",
  status: "Hoạt động",
  note: "",
};

function getInitialForm(computer) {
  if (!computer) {
    return initialForm;
  }

  return {
    ...computer,
    position: computer.position || "",
    qrCode: computer.qrCode || "",
    cpu: computer.cpu || "",
    ram: computer.ram || "",
    gpu: computer.gpu || "",
    mainboard: computer.mainboard || "",
    monitor: computer.monitor || "",
    keyboard: computer.keyboard || "",
    mouse: computer.mouse || "",
    hdd: computer.hdd || "",
    ssd: computer.ssd || "",
    note: computer.note || "",
  };
}

export default function ComputerCreatePage() {
  const navigate = useNavigate();
  const { computerId } = useParams();
  const isEditing = Boolean(computerId);
  const computers = useMemo(() => getComputers(), []);
  const rooms = useMemo(() => getRooms(), []);
  const editingComputer = isEditing
    ? computers.find((computer) => computer.id === Number(computerId))
    : null;
  const [formData, setFormData] = useState(() => getInitialForm(editingComputer));
  const [error, setError] = useState("");

  if (isEditing && !editingComputer) {
    return <Navigate to="/admin/computers" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.room) {
      setError("Vui lòng nhập đầy đủ mã máy, tên máy và phòng.");
      return;
    }
    const duplicatedCode = computers.some((computer) => {
      return computer.code.toUpperCase() === formData.code.trim().toUpperCase()
        && computer.id !== editingComputer?.id;
    });

    if (duplicatedCode) {
      setError("Mã máy đã tồn tại.");
      return;
    }

    const duplicatedNameInRoom = computers.some((computer) => {
      return computer.name?.trim().toUpperCase() === formData.name.trim().toUpperCase()
        && computer.room === formData.room
        && computer.id !== editingComputer?.id;
    });

    if (duplicatedNameInRoom) {
      setError("Tên máy đã tồn tại trong phòng này.");
      return;
    }

    upsertComputer({
      ...formData,
      id: editingComputer?.id,
    });
    navigate("/admin/computers");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa máy tính" : "Thêm máy tính"}
      subtitle={isEditing ? "Cập nhật thông tin định danh, cấu hình và trạng thái máy tính" : "Tạo thông tin định danh, cấu hình và trạng thái máy tính"}
    >
      <SectionCard
        title="Thông tin máy tính"
        rightAction={
          <Link
            to="/admin/computers"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã máy</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: PC022"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tên máy</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Máy 22"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Phòng</span>
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.code}>
                  {room.code}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Vị trí</span>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="VD: Dãy A - Máy 01"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã QR</span>
            <input
              type="text"
              name="qrCode"
              value={formData.qrCode || ""}
              onChange={handleChange}
              placeholder="VD: QR-PC022"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Trạng thái</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">CPU</span>
            <input
              type="text"
              name="cpu"
              value={formData.cpu}
              onChange={handleChange}
              placeholder="VD: Intel Core i5"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">RAM</span>
            <input
              type="text"
              name="ram"
              value={formData.ram}
              onChange={handleChange}
              placeholder="VD: 8GB"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">VGA</span>
            <input
              type="text"
              name="gpu"
              value={formData.gpu}
              onChange={handleChange}
              placeholder="VD: Intel UHD Graphics"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Main / Bo mạch chủ</span>
            <input
              type="text"
              name="mainboard"
              value={formData.mainboard}
              onChange={handleChange}
              placeholder="VD: H610M"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Màn hình</span>
            <input
              type="text"
              name="monitor"
              value={formData.monitor}
              onChange={handleChange}
              placeholder="VD: 21.5 inch"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Bàn phím</span>
            <input
              type="text"
              name="keyboard"
              value={formData.keyboard}
              onChange={handleChange}
              placeholder="VD: Logitech K120"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Chuột</span>
            <input
              type="text"
              name="mouse"
              value={formData.mouse}
              onChange={handleChange}
              placeholder="VD: Logitech B100"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">HDD</span>
            <input
              type="text"
              name="hdd"
              value={formData.hdd}
              onChange={handleChange}
              placeholder="VD: 1TB"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">SSD</span>
            <input
              type="text"
              name="ssd"
              value={formData.ssd}
              onChange={handleChange}
              placeholder="VD: 256GB"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
            <input
              type="text"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              placeholder="Ghi chú máy tính"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to="/admin/computers"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu máy tính
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
