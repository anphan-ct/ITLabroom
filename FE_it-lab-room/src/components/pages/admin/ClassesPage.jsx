import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteClassFromApi, getClassesFromApi } from "../../../services/class.service";

function mapClassroom(classroom) {
  return {
    id: classroom.id,
    code: classroom.ma_lop,
    courseYear: classroom.nien_khoa,
    major: classroom.chuyen_nganh,
    advisor: classroom.giang_vien?.ho_ten || "Chưa phân công",
    studentCount: classroom.so_sinh_vien || 0,
  };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getClassesFromApi()
      .then((response) => {
        if (isMounted) {
          setClasses((response.data || []).map(mapClassroom));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải danh sách lớp học.");
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
  }, []);
  const filteredClasses = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return classes.filter((classroom) => {
      const matchesKeyword =
        !keyword ||
        classroom.code.toLowerCase().includes(keyword) ||
        classroom.courseYear.toLowerCase().includes(keyword) ||
        classroom.major.toLowerCase().includes(keyword) ||
        classroom.advisor.toLowerCase().includes(keyword);

      return matchesKeyword;
    });
  }, [classes, searchKeyword]);

  const handleDelete = async (classroom) => {
    const accepted = window.confirm(`Xóa lớp học ${classroom.code}?`);

    if (accepted) {
      setError("");
      setSuccessMessage("");
      setDeletingId(classroom.id);

      try {
        await deleteClassFromApi(classroom.id);
        setClasses((currentClasses) => currentClasses.filter((item) => item.id !== classroom.id));
        setSuccessMessage(`Đã xóa lớp học ${classroom.code}.`);
      } catch (apiError) {
        setError(apiError.message || "Không thể xóa lớp học.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <AppShell role="admin" title="Quản lý lớp học" subtitle="Danh sách lớp đang hoạt động">
      <SectionCard
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
                placeholder="Tìm mã lớp, niên khóa..."
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
            <Link
              to="/admin/classes/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Thêm lớp
            </Link>
          </div>
        }
        title="Danh sách lớp"
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
        <DataTable
          columns={[
            { key: "code", title: "Mã lớp" },
            { key: "courseYear", title: "Niên khóa" },
            { key: "major", title: "Chuyên ngành" },
            { key: "advisor", title: "GVCN" },
            { key: "studentCount", title: "Số sinh viên" },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, classroom) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/classes/${classroom.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                  >
                    <Edit size={14} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(classroom)}
                    disabled={deletingId === classroom.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <Trash2 size={14} />
                    {deletingId === classroom.id ? "Đang xóa" : "Xóa"}
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredClasses}
          getRowLink={(classroom) => `/admin/classes/${classroom.id}/students`}
          emptyText={isLoading ? "Đang tải danh sách lớp học" : "Chưa có lớp học"}
        />
      </SectionCard>
    </AppShell>
  );
}
