import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import {
  createCourseSectionFromApi,
  getCourseSectionFromApi,
  getCourseSectionOptionsFromApi,
  updateCourseSectionFromApi,
} from "../../../services/courseSection.service";

const initialForm = {
  code: "",
  subjectId: "",
  academicYearId: "",
  classId: "",
  teacherId: "",
  roomId: "",
  maxStudents: "40",
  status: "active",
  note: "",
};

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "paused", label: "Tạm dừng" },
  { value: "completed", label: "Hoàn thành" },
];

function getApiErrorMessage(error) {
  const validationErrors = error.payload?.data;

  if (validationErrors && typeof validationErrors === "object") {
    const firstMessages = Object.values(validationErrors)[0];

    if (Array.isArray(firstMessages) && firstMessages[0]) {
      return firstMessages[0];
    }
  }

  return error.message || "Không thể lưu lớp học phần.";
}

function mapCourseSectionToForm(item) {
  return {
    code: item.ma_lop_hoc_phan || "",
    subjectId: item.ma_mon ? String(item.ma_mon) : "",
    academicYearId: item.ma_nam_hoc ? String(item.ma_nam_hoc) : "",
    classId: item.ma_lop ? String(item.ma_lop) : "",
    teacherId: item.ma_giang_vien ? String(item.ma_giang_vien) : "",
    roomId: item.ma_phong ? String(item.ma_phong) : "",
    maxStudents: String(item.si_so_toi_da || 40),
    status: item.trang_thai || "active",
    note: item.ghi_chu || "",
  };
}

export default function CourseSectionFormPage() {
  const navigate = useNavigate();
  const { courseSectionId } = useParams();
  const isEditing = Boolean(courseSectionId);
  const [formData, setFormData] = useState(initialForm);
  const [options, setOptions] = useState({ subjects: [], academic_years: [], classes: [], teachers: [], rooms: [] });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCourseSectionOptionsFromApi(),
      isEditing ? getCourseSectionFromApi(courseSectionId) : Promise.resolve(null),
    ])
      .then(([optionsResponse, courseSectionResponse]) => {
        if (!isMounted) {
          return;
        }

        const nextOptions = optionsResponse.data || {};
        setOptions(nextOptions);

        if (courseSectionResponse) {
          setFormData(mapCourseSectionToForm(courseSectionResponse.data));
          return;
        }

        setFormData((currentData) => ({
          ...currentData,
          subjectId: nextOptions.subjects?.[0]?.id ? String(nextOptions.subjects[0].id) : "",
          academicYearId: nextOptions.academic_years?.[0]?.id
            ? String(nextOptions.academic_years[0].id) : "",
        }));
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải dữ liệu lớp học phần.");
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
  }, [courseSectionId, isEditing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const maxStudents = Number(formData.maxStudents);

    if (!formData.code.trim() || !formData.subjectId || !formData.academicYearId) {
      setError("Vui lòng nhập đầy đủ mã lớp học phần, môn học và năm học.");
      return;
    }

    if (!Number.isInteger(maxStudents) || maxStudents <= 0) {
      setError("Sĩ số tối đa phải là số nguyên lớn hơn 0.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ma_lop_hoc_phan: formData.code.trim().toUpperCase(),
        ma_mon: Number(formData.subjectId),
        ma_nam_hoc: Number(formData.academicYearId),
        ma_lop: formData.classId ? Number(formData.classId) : null,
        ma_giang_vien: formData.teacherId ? Number(formData.teacherId) : null,
        ma_phong: formData.roomId ? Number(formData.roomId) : null,
        si_so_toi_da: maxStudents,
        trang_thai: formData.status,
        ghi_chu: formData.note.trim() || null,
      };

      if (isEditing) {
        await updateCourseSectionFromApi(courseSectionId, payload);
      } else {
        await createCourseSectionFromApi(payload);
      }

      navigate("/admin/course-sections");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lớp học phần" : "Thêm lớp học phần"}
      subtitle={isEditing ? "Cập nhật thông tin lớp học phần" : "Tạo lớp học phần mới trong hệ thống"}
    >
      <SectionCard title="Thông tin lớp học phần">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            Đang tải dữ liệu lớp học phần...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Mã lớp học phần</span>
              <input type="text" name="code" value={formData.code} onChange={handleChange}
                placeholder="VD: LTWEB-03"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Môn học</span>
              <select name="subjectId" value={formData.subjectId} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                <option value="">Chọn môn học</option>
                {options.subjects?.map((subject) => (
                  <option key={subject.id} value={subject.id}>{subject.ten_mon}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Năm học</span>
              <select name="academicYearId" value={formData.academicYearId} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                <option value="">Chọn năm học</option>
                {options.academic_years?.map((academicYear) => (
                  <option key={academicYear.id} value={academicYear.id}>{academicYear.ten_nam_hoc}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Giảng viên</span>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                <option value="">Chưa phân công</option>
                {options.teachers?.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>{teacher.ho_ten}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Lớp học</span>
              <select name="classId" value={formData.classId} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                <option value="">Chọn lớp học</option>
                {options.classes?.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>{classroom.ma_lop}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Phòng</span>
              <select name="roomId" value={formData.roomId} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                <option value="">Chưa xếp phòng</option>
                {options.rooms?.map((room) => (
                  <option key={room.id} value={room.id}>{room.ma_phong}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Sĩ số tối đa</span>
              <input type="number" name="maxStudents" min="1" value={formData.maxStudents}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Trạng thái</span>
              <select name="status" value={formData.status} onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white">
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
              <textarea name="note" value={formData.note} onChange={handleChange}
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
            </label>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
              <Link to="/admin/course-sections"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                Hủy
              </Link>
              <button type="submit" disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                <Save size={16} />
                {isSaving ? "Đang lưu" : "Lưu lớp học phần"}
              </button>
            </div>
          </form>
        )}
      </SectionCard>
    </AppShell>
  );
}
