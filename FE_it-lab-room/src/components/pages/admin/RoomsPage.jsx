import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteRoom, getRooms } from "../../../data/roomsStore";

export default function RoomsPage() {
  const [rooms, setRooms] = useState(() => getRooms());

  const handleDelete = (room) => {
    const accepted = window.confirm(`Xóa phòng máy ${room.code}?`);

    if (accepted) {
      setRooms(deleteRoom(room.id));
    }
  };

  return (
    <AppShell role="admin" title="Quản lý phòng máy" subtitle="Thông tin phòng máy và trạng thái sử dụng">
      <SectionCard
        rightAction={
          <Link
            to="/admin/rooms/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Thêm phòng
          </Link>
        }
        title="Danh sách phòng máy"
      >
        <DataTable
          columns={[
            { key: "code", title: "Mã phòng" },
            { key: "name", title: "Tên phòng" },
            { key: "location", title: "Vị trí" },
            { key: "computers", title: "Số máy" },
            { key: "status", title: "Trạng thái", isStatus: true },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, room) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/rooms/${room.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                  >
                    <Edit size={14} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(room)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              ),
            },
          ]}
          data={rooms}
        />
      </SectionCard>
    </AppShell>
  );
}
