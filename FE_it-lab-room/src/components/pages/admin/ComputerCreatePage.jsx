import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getComputers, upsertComputer } from "../../../data/computersStore";
import { computerConfigs, getComputerConfig } from "../../../data/computerConfigs";
import { getRooms } from "../../../data/roomsStore";

const statuses = ["Hoạt động", "Hỏng", "Bảo trì"];

const initialForm = {
  code: "",
  name: "",
  room: "",
  configId: "",
  status: "Hoạt động",
  ip: "",
  mac: "",
};

function getInitialForm(computer) {
  if (!computer) {
    return initialForm;
  }

  return {
    ...computer,
    configId: computer.configId || getComputerConfig(computer)?.id || "",
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
      [name]: name === "configId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.room || !formData.configId) {
      setError("Vui lòng nhập đầy đủ mã máy, tên máy, phòng và cấu hình máy.");
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
      subtitle={isEditing ? "Cập nhật thông tin định danh và trạng thái máy tính" : "Tạo thông tin định danh và trạng thái máy tính"}
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

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Cấu hình máy</span>
            <select
              name="configId"
              value={formData.configId}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Chọn cấu hình máy</option>
              {computerConfigs.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.code} - {config.cpu} - {config.ram} - {config.storage}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">IP</span>
            <input
              type="text"
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              placeholder="VD: 192.168.10.22"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">MAC</span>
            <input
              type="text"
              name="mac"
              value={formData.mac}
              onChange={handleChange}
              placeholder="VD: A0-B1-C2-D3-E4-22"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
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
