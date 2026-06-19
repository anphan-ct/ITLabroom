import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import StatusBadge from "../../common/StatusBadge";
import { deleteSchedules, getSchedules } from "../../../data/schedulesStore";

function LessonBadge({ schedule }) {
  return (
    <span className="inline-flex min-w-[84px] justify-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
      Tiết {schedule.lessonStart}-{schedule.lessonEnd}
    </span>
  );
}

export default function SchedulesPage() {
  const [search, setSearch] = useState("");
  const [schedules, setSchedules] = useState(() => getSchedules());

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.studyDate.toLowerCase().includes(keyword) ||
        item.day.toLowerCase().includes(keyword) ||
        item.shift.toLowerCase().includes(keyword) ||
        item.room.toLowerCase().includes(keyword) ||
        item.subject.toLowerCase().includes(keyword) ||
        item.className.toLowerCase().includes(keyword) ||
        item.teacher.toLowerCase().includes(keyword) ||
        item.scheduleType.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword) ||
        String(item.weekNumber).includes(keyword)
      );
    });
  }, [search, schedules]);

  const handleDelete = (schedule) => {
    const accepted = window.confirm(`Xóa lịch ${schedule.subject} - ${schedule.className}?`);

    if (accepted) {
      setSchedules(deleteSchedules([schedule.id]));
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
            <h2 className="text-xl font-bold text-slate-800">
              Danh sách lịch phòng máy
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Tìm lịch phòng"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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

        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="min-w-[1500px] w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">Ngày học</th>
                <th className="px-5 py-4 text-left font-semibold">Tuần</th>
                <th className="px-5 py-4 text-left font-semibold">Thứ</th>
                <th className="px-5 py-4 text-left font-semibold">Ca học</th>
                <th className="px-5 py-4 text-left font-semibold">Tiết</th>
                <th className="px-5 py-4 text-left font-semibold">Phòng</th>
                <th className="px-5 py-4 text-left font-semibold">Môn học</th>
                <th className="px-5 py-4 text-left font-semibold">Lớp</th>
                <th className="px-5 py-4 text-left font-semibold">Giảng viên</th>
                <th className="px-5 py-4 text-left font-semibold">Loại lịch</th>
                <th className="px-5 py-4 text-left font-semibold">Trạng thái</th>
                <th className="px-5 py-4 text-left font-semibold">Ghi chú</th>
                <th className="px-5 py-4 text-center font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredSchedules.map((item) => (
                <tr key={item.id} className="text-slate-700 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">{item.studyDate}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold">
                    Tuần {item.weekNumber}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{item.day}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.shift}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <LessonBadge schedule={item} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-semibold text-blue-700">{item.room}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                    {item.subject}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">{item.className}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.teacher}</td>
                  <td className="whitespace-nowrap px-5 py-4">{item.scheduleType}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <StatusBadge value={item.status} />
                  </td>
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
                        className="rounded-lg bg-rose-100 p-2.5 text-rose-600 hover:bg-rose-200"
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

          {filteredSchedules.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              Không tìm thấy lịch phòng máy phù hợp.
            </div>
          )}
      </div>
    </AppShell>
  );
}
