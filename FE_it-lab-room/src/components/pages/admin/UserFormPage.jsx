import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { getClasses } from "../../../data/classesStore";
import { addUser, getUsers, updateUser } from "../../../data/usersStore";

const roles = ["Admin", "Giảng viên", "Sinh viên"];
const genders = ["Nam", "Nữ", "Khác"];
const statuses = ["Hoạt động", "Tạm khóa"];

function getInitialUser(role) {
  return {
    code: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    department: "",
    classId: "",
    className: "",
    course: "",
    role,
    status: "Hoạt động",
  };
}

function getBackPath(user) {
  if (user.role === "Giảng viên") {
    return "/admin/users/teachers";
  }

  if (user.role === "Sinh viên") {
    return "/admin/users/students";
  }

  return "/admin/users";
}

export default function UserFormPage({ defaultRole = "Admin" }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditing = Boolean(userId);
  const users = useMemo(() => getUsers(), []);
  const classes = useMemo(() => getClasses(), []);
  const editingUser = isEditing ? users.find((user) => user.id === Number(userId)) : null;
  const [formData, setFormData] = useState(editingUser || getInitialUser(defaultRole));
  const [error, setError] = useState("");

  if (isEditing && !editingUser) {
    return <Navigate to="/admin/users" replace />;
  }

  const backPath = getBackPath(formData);
  const pageTitle = isEditing ? "Sửa người dùng" : "Thêm người dùng";
  const pageSubtitle = isEditing ? "Cập nhật thông tin tài khoản người dùng" : "Tạo tài khoản người dùng mới";
  const userCodeLabel = formData.role === "Giảng viên" ? "MSGV" : formData.role === "Sinh viên" ? "MSSV" : "Mã người dùng";
  const isStudentRole = formData.role === "Sinh viên";
  const isTeacherRole = formData.role === "Giảng viên";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Vui lòng nhập đầy đủ họ tên và email.");
      return;
    }

    if ((isStudentRole || isTeacherRole) && !formData.code.trim()) {
      setError(`Vui lòng nhập ${userCodeLabel}.`);
      return;
    }

    if (isTeacherRole && !formData.department.trim()) {
      setError("Vui lòng nhập bộ môn cho giảng viên.");
      return;
    }

    if (isStudentRole && !formData.course.trim()) {
      setError("Vui lòng nhập niên khóa cho sinh viên.");
      return;
    }

    if (isStudentRole && !formData.classId) {
      setError("Vui lòng chọn lớp học cho sinh viên.");
      return;
    }

    const selectedClass = isStudentRole
      ? classes.find((classroom) => classroom.id === Number(formData.classId))
      : null;

    if (isStudentRole && !selectedClass) {
      setError("Vui lòng chọn lớp học hợp lệ cho sinh viên.");
      return;
    }

    const duplicatedEmail = users.some((user) => {
      return user.email.toLowerCase() === formData.email.trim().toLowerCase()
        && user.id !== editingUser?.id;
    });

    if (duplicatedEmail) {
      setError("Email đã tồn tại.");
      return;
    }

    const duplicatedCode = users.some((user) => {
      return user.role === formData.role
        && user.code?.toLowerCase() === formData.code.trim().toLowerCase()
        && user.id !== editingUser?.id;
    });

    if (duplicatedCode) {
      setError(`${userCodeLabel} đã tồn tại.`);
      return;
    }

    if (isEditing) {
      updateUser({
        ...formData,
        classId: selectedClass?.id || "",
        className: selectedClass?.code || "",
        code: isStudentRole || isTeacherRole ? formData.code.trim() : "",
        course: isStudentRole ? formData.course.trim() : "",
        department: isTeacherRole ? formData.department.trim() : "",
      });
    } else {
      addUser({
        ...formData,
        classId: selectedClass?.id || "",
        className: selectedClass?.code || "",
        code: isStudentRole || isTeacherRole ? formData.code.trim() : "",
        course: isStudentRole ? formData.course.trim() : "",
        department: isTeacherRole ? formData.department.trim() : "",
      });
    }

    navigate(getBackPath(formData));
  };

  return (
    <AppShell role="admin" title={pageTitle} subtitle={pageSubtitle}>
      <SectionCard title="Thông tin người dùng">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">{userCodeLabel}</span>
            <input
              type="text"
              name="code"
              disabled={!isStudentRole && !isTeacherRole}
              value={formData.code || ""}
              onChange={handleChange}
              placeholder="VD: SV001 hoặc GV001"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:text-slate-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Họ tên</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@itlab.vn"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Vai trò</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Số điện thoại</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="VD: 0900000001"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giới tính</span>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Chưa cập nhật</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Ngày sinh</span>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ""}
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

          {isTeacherRole && (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Bộ môn</span>
              <input
                type="text"
                name="department"
                value={formData.department || ""}
                onChange={handleChange}
                placeholder="VD: Công nghệ thông tin"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>
          )}

          {isStudentRole && (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Niên khóa</span>
              <input
                type="text"
                name="course"
                value={formData.course || ""}
                onChange={handleChange}
                placeholder="VD: 2022-2026"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>
          )}

          {isStudentRole && (
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Lớp học</span>
              <select
                name="classId"
                value={formData.classId || ""}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="">Chọn lớp học</option>
                {classes.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.code}
                  </option>
                ))}
              </select>
            </label>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to={backPath}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu người dùng
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
