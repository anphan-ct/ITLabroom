import { useEffect, useState } from "react";
import { ArrowLeft, Monitor } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { getRoomComputersFromApi } from "../../../services/room.service";

const statusLabels = {
  active: "Hoạt động",
  broken: "Hỏng",
  maintenance: "Bảo trì",
};

export default function RoomComputersPage() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [computers, setComputers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isStorageRoom = room?.ten_phong?.trim().toLowerCase().includes("kho") || false;

  useEffect(() => {
    let isMounted = true;

    getRoomComputersFromApi(roomId)
      .then((response) => {
        if (isMounted) {
          setRoom(response.data?.room || null);
          setComputers(response.data?.computers || []);
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải danh sách máy tính của phòng.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  return (
    <AppShell
      role="admin"
      title={room ? `Máy tính - ${room.ten_phong}` : "Máy tính theo phòng"}
      subtitle={room ? room.ma_phong : "Danh sách máy tính trong phòng"}
    >
      <SectionCard
        title={room ? `Danh sách máy tính (${computers.length})` : "Danh sách máy tính"}
        rightAction={(
          <Link
            to="/admin/rooms"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        )}
      >
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="py-10 text-center text-sm font-medium text-slate-500">
            Đang tải danh sách máy tính...
          </div>
        )}

        {!error && !isLoading && computers.length === 0 && (
          <div className="py-10 text-center text-sm font-medium text-slate-500">
            Phòng này chưa có máy tính.
          </div>
        )}

        {!error && computers.length > 0 && isStorageRoom && (
          <DataTable
            columns={[
              { key: "ma_may", title: "Mã máy" },
              { key: "ten_may", title: "Tên máy" },
              { key: "vi_tri", title: "Vị trí máy", render: (value) => value || "-" },
              { key: "bo_xu_ly", title: "CPU", render: (value) => value || "-" },
              { key: "ram", title: "RAM", render: (value) => value || "-" },
              { key: "hdd", title: "HDD", render: (value) => value || "-" },
              { key: "ssd", title: "SSD", render: (value) => value || "-" },
              { key: "statusLabel", title: "Trạng thái", isStatus: true },
            ]}
            data={computers.map((computer) => ({
              ...computer,
              statusLabel: statusLabels[computer.trang_thai] || computer.trang_thai,
            }))}
            getRowLink={(computer) => `/admin/computers/${computer.id}`}
          />
        )}

        {!error && computers.length > 0 && !isStorageRoom && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {computers.map((computer) => (
              <Link
                key={computer.id}
                to={`/admin/computers/${computer.id}`}
                className="flex min-h-52 flex-col items-center justify-center rounded-xl border-2 border-blue-400 bg-blue-50/60 p-4 text-center transition hover:-translate-y-0.5 hover:bg-blue-100/70 hover:shadow-md"
              >
                <Monitor size={30} className="mb-3 text-blue-600" />
                <h3 className="font-bold text-slate-900">{computer.ma_may}</h3>
                <p className="mt-3 text-xs leading-5 text-slate-600">
                  CPU: {computer.bo_xu_ly || "Chưa cập nhật"}
                </p>
                <p className="text-xs leading-5 text-slate-600">
                  RAM: {computer.ram || "Chưa cập nhật"}
                </p>
                <p className="text-xs leading-5 text-slate-600">
                  HDD: {computer.hdd || "-"} · SSD: {computer.ssd || "-"}
                </p>
                <span className="mt-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {statusLabels[computer.trang_thai] || computer.trang_thai}
                </span>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </AppShell>
  );
}
