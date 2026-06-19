import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, ClipboardList, Search, XCircle } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import StatusBadge from "../../common/StatusBadge";

const roomBookings = [
  {
    id: 1,
    teacherId: 2,
    teacher: "Trần Thị B",
    roomId: 1,
    room: "PM01",
    subjectId: 1,
    subject: "Lập trình web",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-12",
    shiftId: 1,
    shift: "Ca sáng",
    lessonStart: 1,
    lessonEnd: 5,
    purpose: "Dạy thực hành lập trình web",
    approvalStatus: "pending",
  },
  {
    id: 2,
    teacherId: 1,
    teacher: "Nguyễn Văn A",
    roomId: 2,
    room: "PM02",
    subjectId: 2,
    subject: "Cơ sở dữ liệu",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-13",
    shiftId: 2,
    shift: "Ca chiều",
    lessonStart: 6,
    lessonEnd: 10,
    purpose: "Thực hành truy vấn SQL",
    approvalStatus: "approved",
  },
  {
    id: 3,
    teacherId: 3,
    teacher: "Hoàng Minh Khang",
    roomId: 3,
    room: "PM03",
    subjectId: 3,
    subject: "Mạng máy tính",
    timeSettingId: 1,
    timeSetting: "Học kỳ 2 - 2025/2026",
    bookingDate: "2026-05-14",
    shiftId: 1,
    shift: "Ca sáng",
    lessonStart: 1,
    lessonEnd: 4,
    purpose: "Thực hành cấu hình mạng",
    approvalStatus: "rejected",
  },
];

const bookingStatusOptions = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

const bookingStatusLabels = bookingStatusOptions.reduce((labels, status) => {
  labels[status.value] = status.label;
  return labels;
}, {});

const formatDate = (date) => {
  return new Intl.DateTimeFormat("vi-VN").format(new Date(date));
};

const renderLessonRange = (booking) => {
  if (!booking.lessonStart || !booking.lessonEnd) {
    return "-";
  }

  return `Tiết ${booking.lessonStart} - ${booking.lessonEnd}`;
};

export default function RoomBookingsManagePage() {
  const [bookings, setBookings] = useState(roomBookings);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredBookings = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.approvalStatus === statusFilter;
      const searchContent = [
        booking.id,
        booking.teacher,
        booking.room,
        booking.subject,
        booking.timeSetting,
        booking.bookingDate,
        booking.shift,
        renderLessonRange(booking),
        booking.purpose,
        bookingStatusLabels[booking.approvalStatus],
      ].join(" ").toLowerCase();
      const matchesKeyword = !keyword || searchContent.includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [bookings, searchKeyword, statusFilter]);

  const updateBookingStatus = (bookingId, approvalStatus) => {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, approvalStatus } : booking,
      ),
    );
  };

  return (
    <AppShell role="admin" title="Quản lý đăng ký phòng" subtitle="Duyệt và theo dõi yêu cầu đăng ký sử dụng phòng máy">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng yêu cầu" value={bookings.length.toString().padStart(2, "0")} desc="Yêu cầu đăng ký phòng" icon={<ClipboardList size={22} />} />
        <StatCard title="Chờ duyệt" value={bookings.filter((item) => item.approvalStatus === "pending").length.toString().padStart(2, "0")} desc="Cần admin xử lý" icon={<CalendarCheck size={22} />} />
        <StatCard title="Đã duyệt" value={bookings.filter((item) => item.approvalStatus === "approved").length.toString().padStart(2, "0")} desc="Đã xếp lịch phòng" icon={<CheckCircle2 size={22} />} />
      </div>

      <div className="mt-6">
        <SectionCard
          title="Danh sách đăng ký phòng"
          rightAction={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Tìm đăng ký phòng"
                  className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                {bookingStatusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          }
        >
          <DataTable
            columns={[
              { key: "id", title: "ID", render: (value) => `#${value}` },
              { key: "teacher", title: "Giảng viên" },
              { key: "room", title: "Phòng" },
              { key: "subject", title: "Môn học" },
              { key: "timeSetting", title: "Cài đặt thời gian" },
              { key: "bookingDate", title: "Ngày đặt", render: formatDate },
              { key: "shift", title: "Ca" },
              { key: "lessonRange", title: "Tiết", render: (_, booking) => renderLessonRange(booking) },
              { key: "purpose", title: "Mục đích" },
              {
                key: "approvalStatus",
                title: "Trạng thái",
                render: (value) => <StatusBadge value={bookingStatusLabels[value] || value} />,
              },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, booking) => (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={booking.approvalStatus === "approved"}
                      onClick={() => updateBookingStatus(booking.id, "approved")}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={15} />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      disabled={booking.approvalStatus === "rejected"}
                      onClick={() => updateBookingStatus(booking.id, "rejected")}
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
