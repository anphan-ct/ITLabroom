import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getShifts, upsertShift } from "../../../data/shiftsStore";

const statuses = ["Hoạt động", "Tạm dừng"];

const initialForm = {
  code: "",
  name: "",
  start_time: "06:30",
  end_time: "07:15",
  status: "Hoạt động",
};

export default function ShiftFormPage() {
  const navigate = useNavigate();
  const { shiftId } = useParams();
  const isEditing = Boolean(shiftId);
  const shifts = useMemo(() => getShifts(), []);
  const editingShift = isEditing ? shifts.find((shift) => shift.id === Number(shiftId)) : null;
  const [formData, setFormData] = useState(editingShift || initialForm);
  const [error, setError] = useState("");

  if (isEditing && !editingShift) {
    return <Navigate to="/admin/shifts" replace />;
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

    if (!formData.code.trim() || !formData.name.trim() || !formData.start_time || !formData.end_time) {
      setError("Vui lòng nhập đầy đủ mã ca, tên ca và khung giờ.");
      return;
    }

    if (formData.start_time >= formData.end_time) {
      setError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
      return;
    }

    const duplicatedCode = shifts.some((shift) => {
      return shift.code.toUpperCase() === formData.code.trim().toUpperCase()
        && shift.id !== editingShift?.id;
    });

    if (duplicatedCode) {
      setError("Mã ca đã tồn tại.");
      return;
    }

    upsertShift({
      ...formData,
      id: editingShift?.id,
    });
    navigate("/admin/shifts");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa ca học" : "Thêm ca học"}
      subtitle="Cập nhật khung giờ và trạng thái ca học"
    >
      <SectionCard title="Thông tin ca học">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã ca</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: CA07"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tên ca</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Ca 7"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giờ bắt đầu</span>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giờ kết thúc</span>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
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
              to="/admin/shifts"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu ca học
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
