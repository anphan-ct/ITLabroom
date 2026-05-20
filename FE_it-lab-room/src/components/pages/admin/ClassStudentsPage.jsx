import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { getClasses } from "../../../data/classesStore";
import { getUsers } from "../../../data/usersStore";

export default function ClassStudentsPage() {
  const { classId } = useParams();
  const [searchKeyword, setSearchKeyword] = useState("");
  const classes = useMemo(() => getClasses(), []);
  const classroom = classes.find((item) => item.id === Number(classId));
  const students = useMemo(() => {
    return getUsers().filter((user) => {
      return user.role === "Sinh viên"
        && Number(user.classId) === Number(classId);
    });
  }, [classId]);
  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return students.filter((student) => {
      return (
        !keyword ||
        student.name.toLowerCase().includes(keyword) ||
        (student.code || "").toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword)
      );
    });
  }, [searchKeyword, students]);

  if (!classroom) {
    return <Navigate to="/admin/classes" replace />;
  }

  return (
    <AppShell
      role="admin"
      title={`Sinh viên lớp ${classroom.code}`}
      subtitle={classroom.name}
    >
      <SectionCard
        title="Danh sách sinh viên"
        rightAction={
          <Link
            to="/admin/classes"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Mã lớp</p>
            <p className="mt-2 font-bold text-slate-900">{classroom.code}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Niên khóa</p>
            <p className="mt-2 font-bold text-slate-900">{classroom.courseYear}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Giảng viên</p>
            <p className="mt-2 font-bold text-slate-900">{classroom.advisor}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Sinh viên</p>
            <p className="mt-2 font-bold text-slate-900">{students.length}</p>
          </div>
        </div>

        <input
          type="search"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="Tìm MSSV, họ tên, email..."
          className="mb-5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white md:max-w-md"
        />

        <DataTable
          columns={[
            { key: "code", title: "MSSV" },
            { key: "name", title: "Họ tên" },
            { key: "email", title: "Email" },
            {
              key: "studentRole",
              title: "Vai trò",
              render: (value) => (Number(value) === 1 ? "Lớp trưởng" : "Sinh viên"),
            },
            { key: "course", title: "Niên khóa" },
            { key: "status", title: "Trạng thái", isStatus: true },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, student) => (
                <Link
                  to={`/admin/users/${student.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                >
                  <Edit size={14} />
                  Sửa
                </Link>
              ),
            },
          ]}
          data={filteredStudents}
        />

        {filteredStudents.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            Không tìm thấy sinh viên thuộc lớp này.
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}
