import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getDepartments, upsertDepartment } from "../../../data/departmentsStore";
import { statusOptions } from "./adminPageData";

const initialForm = {
  code: "",
  name: "",
  status: "Hoạt động",
  note: "",
};

export default function DepartmentFormPage() {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const isEditing = Boolean(departmentId);
  const departments = useMemo(() => getDepartments(), []);
  const editingDepartment = isEditing ? departments.find((item) => item.id === Number(departmentId)) : null;
  const [formData, setFormData] = useState(editingDepartment || initialForm);
  const [error, setError] = useState("");

  if (isEditing && !editingDepartment) {
    return <Navigate to="/admin/departments" replace />;
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

    if (!formData.code.trim() || !formData.name.trim()) {
      setError("Vui lòng nhập đầy đủ mã phòng ban và tên phòng ban.");
      return;
    }

    const duplicatedCode = departments.some((department) => {
      return department.code.toUpperCase() === formData.code.trim().toUpperCase()
        && department.id !== editingDepartment?.id;
    });

    if (duplicatedCode) {
      setError("Mã phòng ban đã tồn tại.");
      return;
    }

    upsertDepartment({
      ...formData,
      id: editingDepartment?.id,
      code: formData.code.trim(),
      name: formData.name.trim(),
      note: formData.note.trim(),
    });
    navigate("/admin/departments");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa phòng ban" : "Thêm phòng ban"}
      subtitle={isEditing ? "Cập nhật thông tin phòng ban" : "Tạo phòng ban mới trong hệ thống"}
    >
      <SectionCard title="Thông tin phòng ban">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã phòng ban</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: CNTT"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tên phòng ban</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Công nghệ thông tin"
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
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Mô tả</span>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Ghi chú phòng ban"
              className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to="/admin/departments"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu phòng ban
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
