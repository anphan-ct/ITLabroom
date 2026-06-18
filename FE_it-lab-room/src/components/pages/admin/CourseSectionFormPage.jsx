import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getCourseSections, upsertCourseSection } from "../../../data/courseSectionsStore";
import { rooms, subjects, users } from "../../../data/mockData";

const academicYears = ["2025-2026", "2026-2027"];
const sectionStatuses = ["Hoạt động", "Tạm dừng", "Hoàn thành"];

function getInitialForm() {
  const teacherOptions = users.filter((user) => user.role === "Giảng viên");

  return {
    code: "",
    subject: subjects[0]?.name || "",
    academicYear: academicYears[0],
    teacher: teacherOptions[0]?.name || "",
    room: rooms[0]?.code || "",
    maxStudents: "40",
    status: "Hoạt động",
    note: "",
  };
}

export default function CourseSectionFormPage() {
  const navigate = useNavigate();
  const { courseSectionId } = useParams();
  const isEditing = Boolean(courseSectionId);
  const courseSections = useMemo(() => getCourseSections(), []);
  const teacherOptions = useMemo(() => users.filter((user) => user.role === "Giảng viên"), []);
  const editingCourseSection = isEditing
    ? courseSections.find((item) => item.id === Number(courseSectionId))
    : null;
  const [formData, setFormData] = useState(editingCourseSection
    ? { ...editingCourseSection, maxStudents: String(editingCourseSection.maxStudents) }
    : getInitialForm());
  const [error, setError] = useState("");

  if (isEditing && !editingCourseSection) {
    return <Navigate to="/admin/course-sections" replace />;
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

    if (!formData.code.trim() || !formData.subject || !formData.academicYear) {
      setError("Vui lòng nhập đầy đủ mã lớp học phần, môn học và năm học.");
      return;
    }

    const maxStudents = Number(formData.maxStudents);
    if (!Number.isInteger(maxStudents) || maxStudents <= 0) {
      setError("Sĩ số tối đa phải là số nguyên lớn hơn 0.");
      return;
    }

    const duplicatedCode = courseSections.some((courseSection) => {
      return courseSection.code.toUpperCase() === formData.code.trim().toUpperCase()
        && courseSection.id !== editingCourseSection?.id;
    });

    if (duplicatedCode) {
      setError("Mã lớp học phần đã tồn tại.");
      return;
    }

    upsertCourseSection({
      ...formData,
      id: editingCourseSection?.id,
      code: formData.code.trim(),
      maxStudents,
      note: formData.note.trim(),
    });
    navigate("/admin/course-sections");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lớp học phần" : "Thêm lớp học phần"}
      subtitle={isEditing ? "Cập nhật thông tin lớp học phần" : "Tạo lớp học phần mới trong hệ thống"}
    >
      <SectionCard title="Thông tin lớp học phần">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã lớp học phần</span>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="VD: LTWEB-03"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Môn học</span>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Năm học</span>
            <select
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {academicYears.map((academicYear) => (
                <option key={academicYear} value={academicYear}>{academicYear}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giảng viên</span>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Phòng</span>
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.code}>{room.code}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Sĩ số tối đa</span>
            <input
              type="number"
              name="maxStudents"
              min="1"
              value={formData.maxStudents}
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
              {sectionStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
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
              to="/admin/course-sections"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu lớp học phần
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
