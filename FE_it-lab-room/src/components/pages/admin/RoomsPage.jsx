import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteRoomFromApi, getRoomsFromApi } from "../../../services/room.service";

function getRoomStatus(status) {
  const statusLabels = {
    active: "Hoạt động",
    maintenance: "Bảo trì",
    inactive: "Ngừng dùng",
  };

  return statusLabels[status] || status;
}

function mapRoom(room) {
  return {
    id: room.id,
    code: room.ma_phong,
    name: room.ten_phong,
    capacity: room.suc_chua || 0,
    status: getRoomStatus(room.trang_thai),
    note: room.mo_ta || "",
  };
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getRoomsFromApi()
      .then((response) => {
        if (isMounted) {
          setRooms((response.data || []).map(mapRoom));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải danh sách phòng máy từ cơ sở dữ liệu.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRooms = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return rooms.filter((room) => {
      const searchContent = [room.code, room.name, room.capacity, room.status, room.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [rooms, searchKeyword]);

  const handleDelete = async (room) => {
    const accepted = window.confirm(`Xóa phòng máy ${room.code}?`);

    if (accepted) {
      setError("");
      setSuccessMessage("");
      setDeletingId(room.id);

      try {
        await deleteRoomFromApi(room.id);
        setRooms((currentRooms) => currentRooms.filter((item) => item.id !== room.id));
        setSuccessMessage(`Đã xóa phòng máy ${room.code}.`);
      } catch (apiError) {
        setError(apiError.message || "Không thể xóa phòng máy.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <AppShell role="admin" title="Quản lý phòng máy" subtitle="Thông tin phòng máy và trạng thái sử dụng">
      <SectionCard
        rightAction={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm phòng máy"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
            <Link
              to="/admin/rooms/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Thêm phòng
            </Link>
          </div>
        }
        title="Danh sách phòng máy"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        )}
        <DataTable
          columns={[
            { key: "code", title: "Mã phòng" },
            { key: "name", title: "Tên phòng" },
            { key: "capacity", title: "Sức chứa" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "note", title: "Mô tả" },
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
                    disabled={deletingId === room.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <Trash2 size={14} />
                    {deletingId === room.id ? "Đang xóa" : "Xóa"}
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredRooms}
          getRowLink={(room) => `/admin/rooms/${room.id}/computers`}
          emptyText={error ? "Không có dữ liệu để hiển thị" : "Đang tải danh sách phòng máy"}
        />
      </SectionCard>
    </AppShell>
  );
}
