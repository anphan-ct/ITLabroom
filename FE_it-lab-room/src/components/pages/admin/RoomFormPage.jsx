import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getRooms, upsertRoom } from "../../../data/roomsStore";
import { createRoomFromApi } from "../../../services/room.service";

const statuses = [
  { label: "Hoạt động", value: "active" },
  { label: "Bảo trì", value: "maintenance" },
  { label: "Ngừng dùng", value: "inactive" },
];

const initialForm = {
  code: "",
  name: "",
  location: "",
  capacity: 30,
  status: "active",
  note: "",
};

export default function RoomFormPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isEditing = Boolean(roomId);
  const rooms = useMemo(() => getRooms(), []);
  const editingRoom = isEditing ? rooms.find((room) => room.id === Number(roomId)) : null;
  const [formData, setFormData] = useState(editingRoom || initialForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (isEditing && !editingRoom) {
    return <Navigate to="/admin/rooms" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
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

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ma_phong: formData.code.trim().toUpperCase(),
        ten_phong: formData.name.trim(),
        vi_tri: formData.location.trim(),
        suc_chua: Number(formData.capacity) || 0,
        trang_thai: formData.status,
        mo_ta: formData.note?.trim() || null,
      };

      if (isEditing) {
        upsertRoom({
          ...formData,
          id: editingRoom?.id,
        });
      } else {
        await createRoomFromApi(payload);
      }

      navigate("/admin/rooms");
    } catch (apiError) {
      const validationErrors = apiError.payload?.data;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : "";

      setError(firstValidationError || apiError.message || "Không thể lưu phòng máy.");
    } finally {
      setIsSaving(false);
    }
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
            <span className="text-sm font-semibold text-slate-700">Sức chứa</span>
            <input
              type="number"
              name="capacity"
              min="0"
              value={formData.capacity ?? formData.computers ?? 0}
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
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Mô tả</span>
            <input
              type="text"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              placeholder="Mô tả phòng máy"
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
              to="/admin/rooms"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <Save size={16} />
                {isSaving ? "Đang lưu" : "Lưu phòng máy"}
              </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
