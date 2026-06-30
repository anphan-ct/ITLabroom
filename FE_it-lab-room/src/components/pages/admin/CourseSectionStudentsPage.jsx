import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save, Search, Trash2, X } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import {
  addCourseSectionStudentFromApi,
  deleteCourseSectionStudentByStudentFromApi,
  deleteCourseSectionStudentFromApi,
  getCourseSectionStudentOptionsFromApi,
  getCourseSectionStudentsFromApi,
} from "../../../services/courseSection.service";

const defaultForm = {
  id: null,
  ma_sinh_vien: "",
  trang_thai: "active",
  ghi_chu: "",
};

const statusLabels = {
  active: "Đang học",
  inactive: "Ngừng học",
};

function mapEnrollment(item) {
  return {
    id: item.id,
    detailId: item.detail_id,
    sourceType: item.source_type || "manual",
    sourceLabel: item.source_type === "class" ? "Theo lớp học" : "Thêm riêng",
    studentId: item.ma_sinh_vien,
    studentCode: item.sinh_vien?.ma_sinh_vien || "",
    fullName: item.sinh_vien?.ho_ten || "",
    email: item.sinh_vien?.email || "",
    classCode: item.sinh_vien?.lop?.ma_lop || "",
    courseYear: item.sinh_vien?.nien_khoa || "",
    status: statusLabels[item.trang_thai] || item.trang_thai,
    rawStatus: item.trang_thai,
    note: item.ghi_chu || "",
  };
}

function studentOptionLabel(student) {
  return [
    student.student_code,
    student.full_name,
    student.class_code ? `Lớp ${student.class_code}` : "",
  ]
    .filter(Boolean)
    .join(" - ");
}

export default function CourseSectionStudentsPage() {
  const { courseSectionId } = useParams();
  const [courseSection, setCourseSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [studentOptionKeyword, setStudentOptionKeyword] = useState("");
  const [formData, setFormData] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = useCallback(async () => {
    setError("");

    const [studentsResponse, optionsResponse] = await Promise.all([
      getCourseSectionStudentsFromApi(courseSectionId, { per_page: 100 }),
      getCourseSectionStudentOptionsFromApi(courseSectionId),
    ]);

    setCourseSection(studentsResponse.data?.course_section || null);
    setStudents((studentsResponse.data?.students || []).map(mapEnrollment));
    setStudentOptions(optionsResponse.data?.students || []);
  }, [courseSectionId]);

  useEffect(() => {
    let isMounted = true;

    const timeout = setTimeout(() => {
      loadData()
        .catch((apiError) => {
          if (isMounted) {
            setError(
              apiError.message ||
                "Không thể tải danh sách sinh viên lớp học phần."
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [loadData]);

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return students.filter((student) => {
      const searchContent = [
        student.studentCode,
        student.fullName,
        student.email,
        student.classCode,
        student.courseYear,
        student.status,
        student.note,
      ]
        .join(" ")
        .toLowerCase();

      return !keyword || searchContent.includes(keyword);
    });
  }, [searchKeyword, students]);

  const selectableStudents = useMemo(() => {
    return studentOptions.filter((student) => {
      return (
        (!student.is_enrolled && !student.is_in_class) ||
        Number(student.id) === Number(formData.ma_sinh_vien)
      );
    });
  }, [formData.ma_sinh_vien, studentOptions]);

  const filteredSelectableStudents = useMemo(() => {
    const keyword = studentOptionKeyword.trim().toLowerCase();

    if (!keyword) {
      return selectableStudents;
    }

    return selectableStudents.filter((student) => {
      const searchContent = [
        student.student_code,
        student.full_name,
        student.email,
        student.class_code,
        student.course_year,
      ]
        .join(" ")
        .toLowerCase();

      return searchContent.includes(keyword);
    });
  }, [selectableStudents, studentOptionKeyword]);

  const openCreateForm = () => {
    setFormData(defaultForm);
    setStudentOptionKeyword("");
    setShowForm(true);
    setError("");
    setSuccessMessage("");
  };

  const closeForm = () => {
    if (isSubmitting) {
      return;
    }

    setShowForm(false);
    setFormData(defaultForm);
    setStudentOptionKeyword("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        ma_sinh_vien: Number(formData.ma_sinh_vien),
        trang_thai: formData.trang_thai,
        ghi_chu: formData.ghi_chu.trim() || null,
      };

      await addCourseSectionStudentFromApi(courseSectionId, payload);
      setSuccessMessage("Đã thêm sinh viên vào lớp học phần.");

      setShowForm(false);
      setFormData(defaultForm);
      setStudentOptionKeyword("");
      await loadData();
    } catch (apiError) {
      setError(
        apiError.message || "Không thể lưu sinh viên trong lớp học phần."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (student) => {
    const isClassStudent = student.sourceType === "class";
    const confirmMessage = isClassStudent
      ? `Xóa sinh viên ${student.studentCode} khỏi lớp học phần này? Sinh viên vẫn thuộc lớp ${student.classCode}.`
      : `Xóa sinh viên ${student.studentCode} khỏi lớp học phần?`;

    if (
      !window.confirm(confirmMessage)
    ) {
      return;
    }

    setProcessingId(student.id);
    setError("");
    setSuccessMessage("");

    try {
      if (isClassStudent) {
        await deleteCourseSectionStudentByStudentFromApi(courseSectionId, student.studentId);
        setSuccessMessage(
          `Đã xóa sinh viên ${student.studentCode} khỏi lớp học phần.`
        );
      } else {
        await deleteCourseSectionStudentFromApi(courseSectionId, student.id);
        setSuccessMessage(
          `Đã xóa sinh viên ${student.studentCode} khỏi lớp học phần.`
        );
      }

      await loadData();
    } catch (apiError) {
      setError(apiError.message || "Không thể xóa sinh viên.");
    } finally {
      setProcessingId(null);
    }
  };

  const courseSectionCode = courseSection?.ma_lop_hoc_phan || "";

  return (
    <AppShell
      role="admin"
      title={`Sinh viên lớp học phần ${courseSectionCode}`}
      subtitle={
        courseSection
          ? `${courseSection.mon_hoc?.ten_mon || "Chưa có môn"} - ${
              courseSection.nam_hoc?.ten_nam_hoc || "Chưa có năm học"
            }`
          : "Đang tải thông tin lớp học phần"
      }
    >
      <SectionCard
        title="Danh sách sinh viên"
        rightAction={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm MSSV, họ tên, email..."
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>

            {!showForm && (
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Thêm sinh viên
              </button>
            )}

            <Link
              to="/admin/course-sections"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Quay lại
            </Link>
          </div>
        }
      >
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Mã LHP
            </p>
            <p className="mt-2 font-bold text-slate-900">
              {courseSectionCode || "-"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Môn học
            </p>
            <p className="mt-2 font-bold text-slate-900">
              {courseSection?.mon_hoc?.ten_mon || "-"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Sĩ số
            </p>
            <p className="mt-2 font-bold text-slate-900">
              {students.length}/{courseSection?.si_so_toi_da || 0}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Giảng viên
            </p>
            <p className="mt-2 font-bold text-slate-900">
              {courseSection?.giang_vien?.ho_ten || "Chưa phân công"}
            </p>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Thêm sinh viên vào lớp học phần
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Tìm kiếm và chọn sinh viên chưa thuộc lớp học phần.
                </p>
              </div>

              <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {filteredSelectableStudents.length}/{selectableStudents.length} có thể thêm
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)_auto] lg:items-center">
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={studentOptionKeyword}
                  onChange={(event) =>
                    setStudentOptionKeyword(event.target.value)
                  }
                  placeholder="Tìm MSSV, họ tên, email, lớp..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <select
                required
                value={formData.ma_sinh_vien}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    ma_sinh_vien: event.target.value,
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Chọn sinh viên</option>
                {filteredSelectableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {studentOptionLabel(student)}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <Save size={16} />
                  {isSubmitting ? "Đang lưu" : "Thêm sinh viên"}
                </button>
              </div>
            </div>
          </form>
        )}

        <DataTable
          columns={[
            { key: "studentCode", title: "MSSV" },
            { key: "fullName", title: "Họ tên" },
            { key: "email", title: "Email" },
            { key: "classCode", title: "Lớp" },
            { key: "courseYear", title: "Niên khóa" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "sourceLabel", title: "Nguồn" },
            { key: "note", title: "Ghi chú" },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, student) => {
                return (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(student)}
                      disabled={processingId === student.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <Trash2 size={14} />
                      {processingId === student.id
                        ? "Đang xóa"
                        : student.sourceType === "class"
                          ? "Xóa"
                          : "Xóa"}
                    </button>
                  </div>
                );
              },
            },
          ]}
          data={filteredStudents}
          emptyText={
            isLoading
              ? "Đang tải danh sách sinh viên"
              : "Chưa có sinh viên trong lớp học phần"
          }
        />
      </SectionCard>
    </AppShell>
  );
}
