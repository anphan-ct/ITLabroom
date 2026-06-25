import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import {
  createClassFromApi,
  getClassFromApi,
  getClassOptionsFromApi,
  updateClassFromApi,
} from "../../../services/class.service";

const initialForm = {
  code: "",
  courseYear: "",
  major: "",
  teacherId: "",
};

function mapClassToForm(classroom) {
  return {
    code: classroom.ma_lop || "",
    courseYear: classroom.nien_khoa || "",
    major: classroom.chuyen_nganh || "",
    teacherId: String(classroom.ma_giang_vien || ""),
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

  return error.message || "Không thể lưu lớp học.";
}

export default function ClassFormPage() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const isEditing = Boolean(classId);
  const [formData, setFormData] = useState(initialForm);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const requests = [getClassOptionsFromApi()];

    if (isEditing) {
      requests.push(getClassFromApi(classId));
    }

    Promise.all(requests)
      .then(([optionsResponse, classResponse]) => {
        if (isMounted) {
          setTeachers(optionsResponse.data?.teachers || []);
          if (classResponse) {
            setFormData(mapClassToForm(classResponse.data));
          }
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải dữ liệu lớp học.");
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
  }, [classId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.code.trim() || !formData.courseYear.trim() || !formData.major.trim()) {
      setError("Vui lòng nhập đầy đủ mã lớp, niên khóa và chuyên ngành.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ma_lop: formData.code.trim().toUpperCase(),
        nien_khoa: formData.courseYear.trim(),
        chuyen_nganh: formData.major.trim(),
        ma_giang_vien: formData.teacherId ? Number(formData.teacherId) : null,
      };

      if (isEditing) {
        await updateClassFromApi(classId, payload);
      } else {
        await createClassFromApi(payload);
      }

      navigate("/admin/classes");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lớp học" : "Thêm lớp học"}
      subtitle={isEditing ? "Cập nhật thông tin lớp học" : "Tạo lớp học mới trong hệ thống"}
    >
      <SectionCard title="Thông tin lớp học">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            Đang tải dữ liệu lớp học...
          </div>
        ) : (
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
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Không chọn</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.ma_giang_vien} - {teacher.ho_ten}
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
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Save size={16} />
              {isSaving ? "Đang lưu" : "Lưu lớp học"}
            </button>
          </div>
        </form>
        )}
      </SectionCard>
    </AppShell>
  );
}
