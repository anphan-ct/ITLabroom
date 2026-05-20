import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";

const roomBookings = [
  {
    id: 1,
    teacher: "Trần Thị B",
    room: "PM01",
    date: "12/05/2026",
    day: "Thứ 2",
    shift: "Ca sáng",
    time: "06:30 - 11:25",
    subject: "Lập trình web",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    teacher: "Nguyễn Văn A",
    room: "PM02",
    date: "13/05/2026",
    day: "Thứ 3",
    shift: "Ca chiều",
    time: "12:30 - 17:30",
    subject: "Cơ sở dữ liệu",
    status: "Đã duyệt",
  },
  {
    id: 3,
    teacher: "Hoàng Minh Khang",
    room: "PM03",
    date: "14/05/2026",
    day: "Thứ 4",
    shift: "Ca sáng",
    time: "06:30 - 11:25",
    subject: "Mạng máy tính",
    status: "Từ chối",
  },
];

const bookingStatusOptions = ["Chờ duyệt", "Đã duyệt", "Từ chối"];

export default function RoomBookingsManagePage() {
  const [bookings, setBookings] = useState(roomBookings);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    return statusFilter === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const updateBookingStatus = (bookingId, status) => {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    );
  };

  return (
    <AppShell role="admin" title="Quản lý đăng ký phòng" subtitle="Duyệt và theo dõi yêu cầu đăng ký sử dụng phòng máy">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng yêu cầu" value={bookings.length.toString().padStart(2, "0")} desc="Yêu cầu đăng ký phòng" icon={<ClipboardList size={22} />} />
        <StatCard title="Chờ duyệt" value={bookings.filter((item) => item.status === "Chờ duyệt").length.toString().padStart(2, "0")} desc="Cần admin xử lý" icon={<CalendarCheck size={22} />} />
        <StatCard title="Đã duyệt" value={bookings.filter((item) => item.status === "Đã duyệt").length.toString().padStart(2, "0")} desc="Đã xếp lịch phòng" icon={<CheckCircle2 size={22} />} />
      </div>

      <div className="mt-6">
        <SectionCard
          title="Danh sách đăng ký phòng"
          rightAction={
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          }
        >
          <DataTable
            columns={[
              { key: "teacher", title: "Giảng viên" },
              { key: "room", title: "Phòng" },
              { key: "date", title: "Ngày" },
              { key: "day", title: "Thứ" },
              { key: "shift", title: "Ca" },
              { key: "time", title: "Thời gian" },
              { key: "subject", title: "Môn học" },
              { key: "status", title: "Trạng thái", isStatus: true },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, booking) => (
                  <div className="flex gap-2">
                    <select
                      value={booking.status}
                      onChange={(event) => updateBookingStatus(booking.id, event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
                      aria-label="Cập nhật trạng thái đăng ký phòng"
                    >
                      {bookingStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={booking.status === "Đã duyệt"}
                      onClick={() => updateBookingStatus(booking.id, "Đã duyệt")}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={15} />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      disabled={booking.status === "Từ chối"}
                      onClick={() => updateBookingStatus(booking.id, "Từ chối")}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Từ chối
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredBookings}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
