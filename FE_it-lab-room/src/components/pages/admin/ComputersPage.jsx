import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, Plus } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { computers } from "../../../data/mockData";

export default function ComputersPage() {
  const [roomFilter, setRoomFilter] = useState("all");

  const filteredComputers = useMemo(() => {
    return roomFilter === "all"
      ? computers
      : computers.filter((computer) => computer.room === roomFilter);
  }, [roomFilter]);

  return (
    <AppShell role="admin" title="Quản lý máy tính" subtitle="Theo dõi máy tính, cấu hình và tình trạng thiết bị">
      <div className="space-y-5">
        <SectionCard
          title="Danh sách máy tính"
          rightAction={
            <div className="flex flex-wrap gap-2">
              <select
                value={roomFilter}
                onChange={(event) => setRoomFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="all">Tất cả phòng</option>
                <option value="PM01">PM01</option>
                <option value="PM02">PM02</option>
                <option value="PM03">PM03</option>
              </select>
              <Link
                to="/admin/computers/create"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={17} />
                Thêm máy
              </Link>
            </div>
          }
        >
          <DataTable
            columns={[
              { key: "code", title: "Mã máy" },
              { key: "name", title: "Tên máy" },
              { key: "room", title: "Phòng" },
              { key: "ip", title: "IP" },
              { key: "mac", title: "MAC" },
              { key: "status", title: "Trạng thái", isStatus: true },
              {
                key: "actions",
                title: "Cấu hình",
                render: (_, computer) => (
                  <Link
                    to={`/admin/computers/${computer.code}/config`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                  >
                    <Cpu size={15} />
                    Xem
                  </Link>
                ),
              },
            ]}
            data={filteredComputers}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
