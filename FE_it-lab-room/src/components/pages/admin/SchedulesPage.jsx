import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import StatusBadge from "../../common/StatusBadge";
import {
  deleteComputerLabScheduleFromApi,
  getComputerLabSchedulesFromApi,
} from "../../../services/schedules.service";

function LessonBadge({ schedule }) {
  return (
    <span className="inline-flex min-w-[84px] justify-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
      Tiết {schedule.lessonStart}-{schedule.lessonEnd}
    </span>
  );
}

function mapSchedule(item) {
  return {
    id: item.id,
    studyDate: item.ngay_hoc_cu_the,
    weekNumber: item.tuan?.so_tuan || "-",
    day: item.thu_trong_tuan,
    room: item.phong?.ma_phong || "-",
    subject: item.lop_hoc_phan?.mon_hoc || "-",
    courseSectionCode: item.lop_hoc_phan?.ma_lop_hoc_phan || "-",
    teacher: item.giang_vien?.ho_ten || item.giang_vien?.ma_giang_vien || "-",
    lessonStart: item.so_tiet_bat_dau,
    lessonEnd: item.so_tiet_ket_thuc,
    scheduleType: item.loai_lich,
    status: item.trang_thai,
    note: item.ghi_chu || "",
  };
}

export default function SchedulesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [schedules, setSchedules] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(() => {
      setIsLoading(true);
      setError("");

      getComputerLabSchedulesFromApi({ keyword: search, page, per_page: 20 })
        .then((response) => {
          if (isMounted) {
            setSchedules((response.data?.items || []).map(mapSchedule));
            setPagination(response.data?.pagination || { current_page: 1, last_page: 1, total: 0 });
          }
        })
        .catch((apiError) => {
          if (isMounted) {
            setError(apiError.message || "Không thể tải danh sách lịch phòng máy.");
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [page, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDelete = async (schedule) => {
    const accepted = window.confirm(`Xóa lịch ${schedule.subject} - ${schedule.courseSectionCode}?`);

    if (!accepted) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(schedule.id);

    try {
      await deleteComputerLabScheduleFromApi(schedule.id);
      setSchedules((currentSchedules) => currentSchedules.filter((item) => item.id !== schedule.id));
      setPagination((currentPagination) => ({
        ...currentPagination,
        total: Math.max(0, currentPagination.total - 1),
      }));
      setSuccessMessage("Xóa lịch phòng máy thành công.");
    } catch (apiError) {
      setError(apiError.message || "Không thể xóa lịch phòng máy.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell
      role="admin"
      title="Quản lý lịch phòng máy"
      subtitle="Theo dõi lịch học, phòng máy và khoảng tiết sử dụng"
    >
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Danh sách lịch phòng máy</h2>
            <p className="mt-1 text-sm text-slate-500">Tổng cộng {pagination.total} lịch</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Tìm lịch phòng"
                value={search}
                onChange={handleSearchChange}
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <Link
              to="/admin/schedules/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Thêm lịch
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{successMessage}</div>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full min-w-[1500px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Ngày học</th>
                <th className="px-5 py-4 text-left font-semibold">Tuần</th>
                <th className="px-5 py-4 text-left font-semibold">Thứ</th>
                <th className="px-5 py-4 text-left font-semibold">Tiết</th>
                <th className="px-5 py-4 text-left font-semibold">Phòng</th>
                <th className="px-5 py-4 text-left font-semibold">Môn học</th>
                <th className="px-5 py-4 text-left font-semibold">Lớp học phần</th>
                <th className="px-5 py-4 text-left font-semibold">Giảng viên</th>
                <th className="px-5 py-4 text-left font-semibold">Loại lịch</th>
                <th className="px-5 py-4 text-left font-semibold">Trạng thái</th>
                <th className="px-5 py-4 text-left font-semibold">Ghi chú</th>
                <th className="px-5 py-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {schedules.map((item) => (
                <tr key={item.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{item.studyDate}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">Tuần {item.weekNumber}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.day}</td>
                  <td className="whitespace-nowrap px-5 py-4"><LessonBadge schedule={item} /></td>
                  <td className="whitespace-nowrap px-5 py-4"><span className="font-semibold text-blue-700">{item.room}</span></td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">{item.subject}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.courseSectionCode}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.teacher}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.scheduleType}</td>
                  <td className="whitespace-nowrap px-5 py-4"><StatusBadge value={item.status} /></td>
                  <td className="max-w-[220px] px-5 py-4 text-slate-600">{item.note || "-"}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/schedules/${item.id}/edit`}
                        className="rounded-lg bg-blue-100 p-2.5 text-blue-600 hover:bg-blue-200"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="rounded-lg bg-rose-100 p-2.5 text-rose-600 hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && schedules.length === 0 && (
          <div className="py-10 text-center text-slate-500">Không tìm thấy lịch phòng máy phù hợp.</div>
        )}
        {isLoading && (
          <div className="py-10 text-center text-slate-500">Đang tải danh sách lịch phòng máy...</div>
        )}

        {pagination.last_page > 1 && (
          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-sm font-semibold text-slate-600">{pagination.current_page}/{pagination.last_page}</span>
            <button
              type="button"
              disabled={page >= pagination.last_page}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
