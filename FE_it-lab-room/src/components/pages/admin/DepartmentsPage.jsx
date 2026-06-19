import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { deleteDepartment, getDepartments } from "../../../data/departmentsStore";

export default function DepartmentsPage() {
  const [items, setItems] = useState(() => getDepartments());
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return items.filter((item) => {
      const searchContent = [item.code, item.name, item.status, item.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [items, searchKeyword]);

  const handleDelete = (item) => {
    const accepted = window.confirm(`Xóa phòng ban ${item.code}?`);

    if (accepted) {
      setItems(deleteDepartment(item.id));
    }
  };

  return (
    <AppShell role="admin" title="Quản lý phòng ban" subtitle="Danh mục phòng ban dùng cho giảng viên và phiếu mượn">
      <SectionCard
        title="Danh sách phòng ban"
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
                placeholder="Tìm phòng ban"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
            <Link
              to="/admin/departments/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Thêm phòng ban
            </Link>
          </div>
        }
      >
        <DataTable
          columns={[
            { key: "code", title: "Mã" },
            { key: "name", title: "Tên phòng ban" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "note", title: "Mô tả" },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, item) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/departments/${item.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                  >
                    <Edit size={14} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredItems}
        />
      </SectionCard>
    </AppShell>
  );
}
