import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, ClipboardList, Search, XCircle } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import StatusBadge from "../../common/StatusBadge";
import {
  getAdminRoomBookingsFromApi,
  updateAdminRoomBookingFromApi,
} from "../../../services/roomBooking.service";

const statusOptions = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

const statusLabels = Object.fromEntries(statusOptions.map((status) => [status.value, status.label]));
const formatDate = (date) => date ? new Intl.DateTimeFormat("vi-VN").format(new Date(date)) : "-";

export default function RoomBookingsManagePage() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getAdminRoomBookingsFromApi({
        status: statusFilter,
        keyword: searchKeyword.trim(),
        per_page: 100,
      });
      setBookings(response.data?.items || []);
    } catch (apiError) {
      setError(apiError?.payload?.message || apiError?.message || "Không thể tải đăng ký phòng.");
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(loadBookings, 250);
    return () => clearTimeout(timeout);
  }, [loadBookings]);

  const updateStatus = async (booking, approvalStatus) => {
    setProcessingId(booking.id);
    setMessage("");
    setError("");

    try {
      const response = await updateAdminRoomBookingFromApi(booking.id, approvalStatus);
      setMessage(response.message);
      await loadBookings();
    } catch (apiError) {
      setError(apiError?.payload?.message || apiError?.message || "Không thể xử lý đăng ký phòng.");
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((item) => item.approval_status === "pending").length,
    approved: bookings.filter((item) => item.approval_status === "approved").length,
  }), [bookings]);

  return (
    <AppShell role="admin" title="Quản lý đăng ký phòng" subtitle="Duyệt và theo dõi yêu cầu đăng ký sử dụng phòng máy">
      {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div> : null}
      {message ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng yêu cầu" value={String(stats.total).padStart(2, "0")} desc="Theo bộ lọc hiện tại" icon={<ClipboardList size={22} />} />
        <StatCard title="Chờ duyệt" value={String(stats.pending).padStart(2, "0")} desc="Cần admin xử lý" icon={<CalendarCheck size={22} />} />
        <StatCard title="Đã duyệt" value={String(stats.approved).padStart(2, "0")} desc="Đã xác nhận giữ phòng" icon={<CheckCircle2 size={22} />} />
      </div>

      <div className="mt-6">
        <SectionCard
          title="Danh sách đăng ký phòng"
          rightAction={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="search" value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="Giảng viên, phòng" className="w-full min-w-[250px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none" />
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
                <option value="">Tất cả trạng thái</option>
                {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </div>
          }
        >
          <DataTable
            emptyText={isLoading ? "Đang tải dữ liệu..." : "Chưa có yêu cầu đăng ký phòng"}
            columns={[
              { key: "id", title: "ID", render: (value) => `#${value}` },
              { key: "teacher", title: "Giảng viên", render: (value) => value?.name || "-" },
              { key: "room", title: "Phòng", render: (value) => value?.code || "-" },
              { key: "date", title: "Ngày đặt", render: formatDate },
              { key: "lesson_start", title: "Tiết", render: (value, row) => `Tiết ${value} - ${row.lesson_end}` },
              { key: "purpose", title: "Mục đích" },
              { key: "approval_status", title: "Trạng thái", render: (value) => <StatusBadge value={statusLabels[value] || value} /> },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, booking) => booking.approval_status === "pending" ? (
                  <div className="flex gap-2">
                    <button type="button" disabled={processingId === booking.id} onClick={() => updateStatus(booking, "approved")} className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-emerald-700 disabled:opacity-50">
                      <CheckCircle2 size={15} /> Duyệt
                    </button>
                    <button type="button" disabled={processingId === booking.id} onClick={() => updateStatus(booking, "rejected")} className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 disabled:opacity-50">
                      <XCircle size={15} /> Từ chối
                    </button>
                  </div>
                ) : "Đã xử lý",
              },
            ]}
            data={bookings}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
