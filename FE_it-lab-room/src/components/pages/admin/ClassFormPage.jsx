import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getClasses, upsertClass } from "../../../data/classesStore";
import { getUsers } from "../../../data/usersStore";

const initialForm = {
  code: "",
  courseYear: "",
  major: "",
  advisor: "",
};

export default function ClassFormPage() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const isEditing = Boolean(classId);
  const classes = useMemo(() => getClasses(), []);
  const teachers = useMemo(() => getUsers().filter((user) => user.role === "Giảng viên"), []);
  const editingClass = isEditing ? classes.find((classroom) => classroom.id === Number(classId)) : null;
  const [formData, setFormData] = useState(editingClass || initialForm);
  const [error, setError] = useState("");

  if (isEditing && !editingClass) {
    return <Navigate to="/admin/classes" replace />;
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

    if (!formData.code.trim() || !formData.courseYear.trim() || !formData.major.trim()) {
      setError("Vui lòng nhập đầy đủ mã lớp, niên khóa và chuyên ngành.");
      return;
    }

    const duplicatedCode = classes.some((classroom) => {
      return classroom.code.toUpperCase() === formData.code.trim().toUpperCase()
        && classroom.id !== editingClass?.id;
    });

    if (duplicatedCode) {
      setError("Mã lớp đã tồn tại.");
      return;
    }

    upsertClass({
      ...formData,
      courseYear: formData.courseYear.trim(),
      major: formData.major.trim(),
      id: editingClass?.id,
    });
    navigate("/admin/classes");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lớp học" : "Thêm lớp học"}
      subtitle={isEditing ? "Cập nhật thông tin lớp học" : "Tạo lớp học mới trong hệ thống"}
    >
      <SectionCard title="Thông tin lớp học">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã lớp</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: CNTT03"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Chuyên ngành</span>
            <input
              type="text"
              name="major"
              value={formData.major || ""}
              onChange={handleChange}
              placeholder="VD: Công nghệ thông tin"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Niên khóa</span>
            <input
              type="text"
              name="courseYear"
              value={formData.courseYear || ""}
              onChange={handleChange}
              placeholder="VD: 2022-2026"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giảng viên chủ nhiệm</span>
            <select
              name="advisor"
              value={formData.advisor}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Không chọn</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>
                  {teacher.code ? `${teacher.code} - ${teacher.name}` : teacher.name}
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
              to="/admin/classes"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu lớp học
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
