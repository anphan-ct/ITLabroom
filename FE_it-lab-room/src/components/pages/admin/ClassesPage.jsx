import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
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
          <Link
            to="/admin/classes/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Thêm lớp
          </Link>
        }
        title="Danh sách lớp"
      >
        <div className="mb-5">
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="Tìm mã lớp, niên khóa, giảng viên..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white md:max-w-md"
          />
        </div>

        <DataTable
          columns={[
            { key: "code", title: "Mã lớp" },
            { key: "courseYear", title: "Niên khóa" },
            { key: "size", title: "Sĩ số" },
            { key: "advisor", title: "Giảng viên" },
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
