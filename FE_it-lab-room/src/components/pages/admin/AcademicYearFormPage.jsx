import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import {
  createAcademicYearFromApi,
  getAcademicYearFromApi,
  updateAcademicYearFromApi,
} from "../../../services/academicYear.service";

const initialForm = {
  name: "",
  startDate: "",
  endDate: "",
};

function mapAcademicYearToForm(item) {
  return {
    name: item.ten_nam_hoc || "",
    startDate: item.ngay_bat_dau || "",
    endDate: item.ngay_ket_thuc || "",
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

  return error.message || "Không thể lưu năm học.";
}

export default function AcademicYearFormPage() {
  const navigate = useNavigate();
  const { academicYearId } = useParams();
  const isEditing = Boolean(academicYearId);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      return undefined;
    }

    let isMounted = true;

    getAcademicYearFromApi(academicYearId)
      .then((response) => {
        if (isMounted) {
          setFormData(mapAcademicYearToForm(response.data));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải dữ liệu năm học.");
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
  }, [academicYearId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
      setError("Vui lòng nhập đầy đủ tên năm học và khoảng thời gian.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = {
        ten_nam_hoc: formData.name.trim(),
        ngay_bat_dau: formData.startDate,
        ngay_ket_thuc: formData.endDate,
      };

      if (isEditing) {
        await updateAcademicYearFromApi(academicYearId, payload);
      } else {
        await createAcademicYearFromApi(payload);
      }

      navigate("/admin/academic-years");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa năm học" : "Thêm năm học"}
      subtitle={isEditing ? "Cập nhật thông tin năm học" : "Tạo năm học và tự động chia tuần học"}
    >
      <SectionCard title="Thông tin năm học">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            Đang tải dữ liệu năm học...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tên năm học</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: 2024-2025"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ngày bắt đầu</span>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Ngày kết thúc</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
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
                to="/admin/academic-years"
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
                {isSaving ? "Đang lưu" : "Lưu năm học"}
              </button>
            </div>
          </form>
        )}
      </SectionCard>
    </AppShell>
  );
}
