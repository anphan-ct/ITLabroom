import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { createSubjectFromApi, getSubjectFromApi, updateSubjectFromApi } from "../../../services/subject.service";

const initialForm = {
  code: "",
  name: "",
  type: "LT",
  credits: 3,
  note: "",
};

const subjectTypes = ["LT", "TH"];

function mapSubjectToForm(subject) {
  return {
    code: subject.ma_mon_hoc || "",
    name: subject.ten_mon || "",
    type: subject.loai_mon || "LT",
    credits: subject.so_tin_chi || 1,
    note: subject.mo_ta || "",
  };
}

function getApiErrorMessage(error) {
  const validationErrors = error.payload?.data;

  if (validationErrors && typeof validationErrors === "object") {
    const firstMessages = Object.values(validationErrors)[0];

    if (Array.isArray(firstMessages) && firstMessages[0]) {
      return firstMessages[0];
    }
  }

  return error.message || "Không thể lưu môn học.";
}

export default function SubjectFormPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const isEditing = Boolean(subjectId);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return undefined;
    }

    let isMounted = true;

    getSubjectFromApi(subjectId)
      .then((response) => {
        if (isMounted) {
          setFormData(mapSubjectToForm(response.data));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải dữ liệu môn học.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isEditing, subjectId]);

  const pageTitle = isEditing ? "Sửa môn học" : "Thêm môn học";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: name === "credits" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.type) {
      setError("Vui lòng nhập đầy đủ tên môn và loại môn.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ma_mon_hoc: formData.code?.trim().toUpperCase() || null,
        ten_mon: formData.name.trim(),
        loai_mon: formData.type,
        so_tin_chi: Number(formData.credits),
        mo_ta: formData.note?.trim() || null,
      };

      if (isEditing) {
        await updateSubjectFromApi(subjectId, payload);
      } else {
        await createSubjectFromApi(payload);
      }

      navigate("/admin/subjects");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      role="admin"
      title={pageTitle}
      subtitle={isEditing ? "Cập nhật thông tin môn học" : "Tạo môn học mới trong danh mục"}
    >
      <SectionCard title="Thông tin môn học">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            Đang tải dữ liệu môn học...
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã môn học</span>
            <input
              type="text"
              name="code"
              value={formData.code || ""}
              onChange={handleChange}
              placeholder="VD: LTWEB"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

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

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Mô tả</span>
            <input
              type="text"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              placeholder="Mô tả môn học"
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
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Save size={16} />
              {isSaving ? "Đang lưu" : "Lưu môn học"}
            </button>
          </div>
        </form>
        )}
      </SectionCard>
    </AppShell>
  );
}
