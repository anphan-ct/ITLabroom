import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { getUsers } from "../../../data/usersStore";

const userPageConfig = {
  students: {
    title: "Quản lý sinh viên",
    subtitle: "Danh sách tài khoản sinh viên",
    sectionTitle: "Danh sách sinh viên",
    addLabel: "+ Thêm sinh viên",
    addPath: "/admin/users/students/create",
    codeTitle: "MSSV",
    searchPlaceholder: "Tìm theo tên hoặc MSSV",
    roles: ["Sinh viên"],
  },
  teachers: {
    title: "Quản lý giảng viên",
    subtitle: "Danh sách tài khoản giảng viên",
    sectionTitle: "Danh sách giảng viên",
    addLabel: "+ Thêm giảng viên",
    addPath: "/admin/users/teachers/create",
    codeTitle: "MSGV",
    searchPlaceholder: "Tìm theo tên hoặc MSGV",
    roles: ["Giảng viên"],
  },
  all: {
    title: "Quản lý người dùng",
    subtitle: "Danh sách admin, giảng viên, sinh viên",
    sectionTitle: "Danh sách người dùng",
    addLabel: "+ Thêm người dùng",
    addPath: "/admin/users/create",
    roles: null,
  },
};

export default function UsersPage({ type = "all" }) {
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [courseYearFilter, setCourseYearFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [users] = useState(() => getUsers());
  const config = userPageConfig[type] || userPageConfig.all;
  const hasAdvancedFilters = type === "students" || type === "teachers";
  const baseUsers = useMemo(
    () => (config.roles ? users.filter((user) => config.roles.includes(user.role)) : users),
    [config.roles, users],
  );
  const facultyOptions = useMemo(
    () => Array.from(new Set(baseUsers.map((user) => user.faculty).filter(Boolean))),
    [baseUsers],
  );
  const courseYearOptions = useMemo(
    () => Array.from(new Set(baseUsers.map((user) => user.course).filter(Boolean))),
    [baseUsers],
  );
  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return baseUsers.filter((user) => {
      const matchesFaculty = facultyFilter === "all" || user.faculty === facultyFilter;
      const matchesCourseYear = type !== "students" || courseYearFilter === "all" || user.course === courseYearFilter;
      const matchesKeyword =
        !keyword ||
        user.name.toLowerCase().includes(keyword) ||
        (user.code || "").toLowerCase().includes(keyword);

      return matchesFaculty && matchesCourseYear && matchesKeyword;
    });
  }, [baseUsers, courseYearFilter, facultyFilter, searchKeyword, type]);
  const columns = [
    ...(hasAdvancedFilters ? [{ key: "code", title: config.codeTitle }] : []),
    { key: "name", title: "Họ tên" },
    { key: "email", title: "Email" },
    {
      key: "role",
      title: "Vai trò",
      render: (_, user) => {
        if (type === "students") {
          return Number(user.studentRole) === 1 ? "Lớp trưởng" : "Sinh viên";
        }

        return user.role;
      },
    },
    ...(hasAdvancedFilters ? [{ key: "faculty", title: "Khoa" }] : []),
    ...(type === "students" ? [{ key: "className", title: "Lớp" }] : []),
    ...(type === "students" ? [{ key: "course", title: "Niên khóa" }] : []),
    { key: "status", title: "Trạng thái", isStatus: true },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, user) => (
        <div className="flex gap-2">
          <Link
            to={`/admin/users/${user.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
          >
            <Edit size={14} />
            Sửa
          </Link>
          {user.status === "Hoạt động" ? (
            <button className="rounded-lg bg-slate-100 px-3 py-1 text-slate-700">Khóa</button>
          ) : (
            <button className="rounded-lg bg-emerald-100 px-3 py-1 text-emerald-700">Mở khóa</button>
          )}
          <button className="rounded-lg bg-rose-100 px-3 py-1 text-rose-700">Xóa</button>
        </div>
      ),
    },
  ];

  return (
    <AppShell role="admin" title={config.title} subtitle={config.subtitle}>
      <SectionCard
        title={config.sectionTitle}
        rightAction={
          <Link
            to={config.addPath}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {config.addLabel}
          </Link>
        }
      >
        {hasAdvancedFilters && (
          <div className={`mb-5 grid gap-3 ${type === "students" ? "md:grid-cols-[minmax(0,1fr)_220px_220px]" : "md:grid-cols-[minmax(0,1fr)_240px]"}`}>
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder={config.searchPlaceholder}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

            <select
              value={facultyFilter}
              onChange={(event) => setFacultyFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="all">Tất cả khoa</option>
              {facultyOptions.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>

            {type === "students" && (
              <select
                value={courseYearFilter}
                onChange={(event) => setCourseYearFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              >
                <option value="all">Tất cả niên khóa</option>
                {courseYearOptions.map((courseYear) => (
                  <option key={courseYear} value={courseYear}>
                    {courseYear}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <DataTable
          columns={columns}
          data={filteredUsers}
        />
      </SectionCard>
    </AppShell>
  );
}
