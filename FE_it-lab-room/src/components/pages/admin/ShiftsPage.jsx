import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import { deleteShift, getShifts } from "../../../data/shiftsStore";

function StatusBadge({ status }) {
  const styles = {
    "Hoạt động": "bg-emerald-100 text-emerald-700",
    "Tạm dừng": "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex min-w-[96px] justify-center rounded-full px-3 py-1 text-sm font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function ShiftsPage() {
  const [search, setSearch] = useState("");
  const [shifts, setShifts] = useState(() => getShifts());

  const filteredShifts = useMemo(() => {
    return shifts.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        item.code.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.start_time.toLowerCase().includes(keyword) ||
        item.end_time.toLowerCase().includes(keyword)
      );
    });
  }, [search, shifts]);

  const totalShifts = shifts.length;
  const activeShifts = shifts.filter(
    (item) => item.status === "Hoạt động"
  ).length;
  const pausedShifts = shifts.filter(
    (item) => item.status === "Tạm dừng"
  ).length;

  const handleDelete = (shift) => {
    const accepted = window.confirm(`Xóa ca học ${shift.name}?`);

    if (accepted) {
      setShifts(deleteShift(shift.id));
    }
  };

  return (
    <AppShell
      role="admin"
      title="Quản lý ca học"
      subtitle="Theo dõi khung giờ học và trạng thái hoạt động của từng ca"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tổng số ca học</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {totalShifts}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Đang hoạt động</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {activeShifts}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tạm dừng</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-600">
              {pausedShifts}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Danh sách ca học
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-[320px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Tìm mã ca, tên ca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <Link
                to="/admin/shifts/create"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Thêm ca học
              </Link>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-100 lg:block">
            <div className="grid grid-cols-6 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
              <div>Mã ca</div>
              <div>Tên ca</div>
              <div>Giờ bắt đầu</div>
              <div>Giờ kết thúc</div>
              <div>Trạng thái</div>
              <div className="text-center">Thao tác</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredShifts.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-6 items-center px-5 py-4 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <div className="font-semibold">{item.code}</div>
                  <div>{item.name}</div>
                  <div>{item.start_time}</div>
                  <div>{item.end_time}</div>
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/shifts/${item.id}/edit`}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg bg-rose-100 p-2 text-rose-600 hover:bg-rose-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:hidden">
            {filteredShifts.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.code}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <span className="font-medium text-slate-500">Bắt đầu:</span>{" "}
                    {item.start_time}
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">
                      Kết thúc:
                    </span>{" "}
                    {item.end_time}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/admin/shifts/${item.id}/edit`}
                    className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700"
                  >
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredShifts.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              Không tìm thấy ca học phù hợp.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
