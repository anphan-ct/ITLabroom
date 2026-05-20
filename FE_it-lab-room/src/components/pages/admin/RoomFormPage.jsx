import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getRooms, upsertRoom } from "../../../data/roomsStore";

const statuses = ["Sẵn sàng", "Đang sử dụng", "Bảo trì"];

const initialForm = {
  code: "",
  name: "",
  location: "",
  computers: 30,
  status: "Sẵn sàng",
};

export default function RoomFormPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isEditing = Boolean(roomId);
  const rooms = useMemo(() => getRooms(), []);
  const editingRoom = isEditing ? rooms.find((room) => room.id === Number(roomId)) : null;
  const [formData, setFormData] = useState(editingRoom || initialForm);
  const [error, setError] = useState("");

  if (isEditing && !editingRoom) {
    return <Navigate to="/admin/rooms" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: name === "computers" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.code.trim() || !formData.name.trim() || !formData.location.trim()) {
      setError("Vui lòng nhập đầy đủ mã phòng, tên phòng và vị trí.");
      return;
    }

    const duplicatedCode = rooms.some((room) => {
      return room.code.toUpperCase() === formData.code.trim().toUpperCase()
        && room.id !== editingRoom?.id;
    });

    if (duplicatedCode) {
      setError("Mã phòng đã tồn tại.");
      return;
    }

    upsertRoom({
      ...formData,
      id: editingRoom?.id,
    });
    navigate("/admin/rooms");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa phòng máy" : "Thêm phòng máy"}
      subtitle={isEditing ? "Cập nhật thông tin và trạng thái phòng máy" : "Tạo phòng máy mới trong hệ thống"}
    >
      <SectionCard title="Thông tin phòng máy">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã phòng</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: PM04"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tên phòng</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Phòng máy 04"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Vị trí</span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="VD: Tầng 4"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Số máy</span>
            <input
              type="number"
              name="computers"
              min="0"
              value={formData.computers}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
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

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to="/admin/rooms"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu phòng máy
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
