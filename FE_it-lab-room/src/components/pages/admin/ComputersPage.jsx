import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { computerConfigs, getComputerConfig } from "../../../data/computerConfigs";
import { deleteComputer, getComputers } from "../../../data/computersStore";

export default function ComputersPage() {
  const [computers, setComputers] = useState(() => getComputers());
  const [roomFilter, setRoomFilter] = useState("all");

  const filteredComputers = useMemo(() => {
    return roomFilter === "all"
      ? computers
      : computers.filter((computer) => computer.room === roomFilter);
  }, [computers, roomFilter]);

  const handleDelete = (computer) => {
    const accepted = window.confirm(`Xóa máy tính ${computer.code}?`);

    if (accepted) {
      setComputers(deleteComputer(computer.id));
    }
  };

  const getConfigCode = (computer) => {
    const config = computerConfigs.find((item) => item.id === Number(computer.configId))
      || getComputerConfig(computer);

    return config?.code || "Chưa chọn";
  };

  return (
    <AppShell role="admin" title="Quản lý máy tính" subtitle="Theo dõi thông tin định danh, phòng và trạng thái máy tính">
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
              {
                key: "configId",
                title: "Cấu hình",
                render: (_, computer) => getConfigCode(computer),
              },
              { key: "ip", title: "IP" },
              { key: "mac", title: "MAC" },
              { key: "status", title: "Trạng thái", isStatus: true },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, computer) => (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/computers/${computer.id}/edit`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                    >
                      <Edit size={15} />
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(computer)}
                      className="inline-flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                    >
                      <Trash2 size={15} />
                      Xóa
                    </button>
                  </div>
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
