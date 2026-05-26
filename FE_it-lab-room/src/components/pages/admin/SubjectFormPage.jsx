import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getSubjects, upsertSubject } from "../../../data/subjectsStore";

const initialForm = {
  name: "",
  type: "LT",
  credits: 3,
};

const subjectTypes = ["LT", "TH"];

function getInitialForm(subject) {
  if (!subject) {
    return initialForm;
  }

  return {
    ...subject,
    type: subject.type || "LT",
  };
}

export default function SubjectFormPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const subjects = useMemo(() => getSubjects(), []);
  const editingSubject = subjectId
    ? subjects.find((subject) => subject.id === Number(subjectId))
    : null;
  const [formData, setFormData] = useState(() => getInitialForm(editingSubject));
  const [error, setError] = useState("");

  if (subjectId && !editingSubject) {
    return <Navigate to="/admin/subjects" replace />;
  }

  const pageTitle = editingSubject ? "Sửa môn học" : "Thêm môn học";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: name === "credits" ? Number(value) : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      setError("Vui lòng nhập đầy đủ tên môn và loại môn.");
      return;
    }

    const duplicatedName = subjects.some((subject) => {
      return subject.name.toLowerCase() === formData.name.trim().toLowerCase()
        && subject.id !== editingSubject?.id;
    });

    if (duplicatedName) {
      setError("Tên môn đã tồn tại.");
      return;
    }

    upsertSubject({
      ...formData,
      id: editingSubject?.id,
    });
    navigate("/admin/subjects");
  };

  return (
    <AppShell
      role="admin"
      title={pageTitle}
      subtitle={editingSubject ? "Cập nhật thông tin môn học" : "Tạo môn học mới trong danh mục"}
    >
      <SectionCard title="Thông tin môn học">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tên môn</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Lập trình web"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Loại</span>
            <select
              name="type"
              value={formData.type || "LT"}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {subjectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">ĐVHP</span>
            <input
              type="number"
              name="credits"
              min="1"
              max="10"
              value={formData.credits}
              onChange={handleChange}
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
              to="/admin/subjects"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu môn học
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
