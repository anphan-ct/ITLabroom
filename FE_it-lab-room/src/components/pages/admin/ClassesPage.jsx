import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteClass, getClasses } from "../../../data/classesStore";

export default function ClassesPage() {
  const [classes, setClasses] = useState(() => getClasses());
  const [searchKeyword, setSearchKeyword] = useState("");
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

  const handleDelete = (classroom) => {
    const accepted = window.confirm(`Xóa lớp học ${classroom.code}?`);

    if (accepted) {
      setClasses(deleteClass(classroom.id));
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
        <DataTable
          columns={[
            { key: "code", title: "Mã lớp" },
            { key: "courseYear", title: "Niên khóa" },
            { key: "major", title: "Chuyên ngành" },
            { key: "advisor", title: "GVCN" },
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
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredClasses}
          getRowLink={(classroom) => `/admin/classes/${classroom.id}/students`}
        />
      </SectionCard>
    </AppShell>
  );
}
