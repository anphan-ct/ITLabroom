import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import { computers, rooms } from "../../../data/mockData";

export default function ComputerLookupPage() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [search, setSearch] = useState("");

  const filteredComputers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return computers.filter((item) => {
      const matchRoom = selectedRoom === "all" || item.room === selectedRoom;
      const matchKeyword =
        keyword.length === 0 ||
        [
          item.code,
          item.name,
          item.room,
          item.ip,
          item.mac,
          item.cpu,
          item.ram,
          item.storage,
          item.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchRoom && matchKeyword;
    });
  }, [search, selectedRoom]);

  return (
    <AppShell
      role="student"
      title="Tra cứu thông tin máy tính"
      subtitle="Xem cấu hình và tình trạng máy"
    >
      <SectionCard
        title="Danh sách máy trong phòng thực hành"
        rightAction={
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="h-11 min-w-[180px] px-3"
              onChange={(event) => setSelectedRoom(event.target.value)}
              value={selectedRoom}
            >
              <option value="all">Tất cả phòng</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.code}>
                  {room.code} - {room.name}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-[320px]">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                className="h-11 w-full pl-10 pr-3"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm mã máy, IP, cấu hình..."
                value={search}
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Mã máy</th>
                <th className="px-4 py-3 text-left">Tên máy</th>
                <th className="px-4 py-3 text-left">Phòng</th>
                <th className="px-4 py-3 text-left">IP</th>
                <th className="px-4 py-3 text-left">CPU</th>
                <th className="px-4 py-3 text-left">RAM</th>
                <th className="px-4 py-3 text-left">Ổ cứng</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredComputers.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                    {item.code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-blue-700">
                    {item.room}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.ip}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.cpu}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.ram}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {item.storage}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge value={item.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() =>
                        navigate("/student/incidents", {
                          state: { computerCode: item.code, room: item.room },
                        })
                      }
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Báo hỏng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComputers.length === 0 && (
            <div className="bg-white px-4 py-10 text-center text-sm text-slate-500">
              Không tìm thấy máy phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>
      </SectionCard>
    </AppShell>
  );
}
