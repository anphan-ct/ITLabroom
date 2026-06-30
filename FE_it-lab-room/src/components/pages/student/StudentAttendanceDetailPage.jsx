import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Monitor,
} from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import {
  formatVietnameseDate,
  mapComputerLabSchedule,
} from "../../../helpers/computer-lab-schedule.helper";
import {
  checkInStudentAttendanceFromApi,
  getStudentScheduleAttendanceFromApi,
} from "../../../services/attendance.service";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function StudentAttendanceDetailPage() {
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [attendanceWindow, setAttendanceWindow] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [computers, setComputers] = useState([]);
  const [selectedComputerId, setSelectedComputerId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    getStudentScheduleAttendanceFromApi(scheduleId)
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const payload = response.data || {};
        const mappedSchedule = payload.schedule
          ? mapComputerLabSchedule({
              ...payload.schedule,
              attendance_window: payload.attendance_window,
            })
          : null;

        setSchedule(mappedSchedule);
        setAttendanceWindow(mappedSchedule?.attendanceWindow || null);
        setAttendance(payload.attendance || null);
        setComputers(payload.computers || []);
        setSelectedComputerId(payload.attendance?.computer?.id || "");
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(
            apiError?.payload?.message ||
              apiError.message ||
              "Không thể tải chi tiết điểm danh."
          );
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
  }, [scheduleId]);

  const hasCheckedIn = Boolean(attendance?.id);
  const canCheckIn = attendanceWindow?.status === "open" && !hasCheckedIn;

  const handleCheckIn = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!canCheckIn) {
      setError(
        attendanceWindow?.status === "closed"
          ? "Điểm danh đã đóng."
          : "Chưa tới thời gian điểm danh."
      );
      return;
    }

    if (!selectedComputerId) {
      setError("Vui lòng chọn máy tính.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await checkInStudentAttendanceFromApi(scheduleId, {
        ma_may_tinh: Number(selectedComputerId),
      });

      setAttendance(response.data?.attendance || null);
      setAttendanceWindow(
        response.data?.attendance_window
          ? {
              status: response.data.attendance_window.status,
              statusLabel: response.data.attendance_window.status_label,
              startsAt: response.data.attendance_window.starts_at,
              endsAt: response.data.attendance_window.ends_at,
              serverTime: response.data.attendance_window.server_time,
            }
          : attendanceWindow
      );
      setSuccessMessage(response.message || "Điểm danh thành công.");
    } catch (apiError) {
      setError(
        apiError?.payload?.message ||
          apiError.message ||
          "Không thể thực hiện điểm danh."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoading && !error && !schedule) {
    return <Navigate to="/student/attendance" replace />;
  }

  return (
    <AppShell
      role="student"
      title="Chi tiết điểm danh"
      subtitle="Chọn máy tính đang sử dụng để điểm danh"
    >
      <SectionCard
        title={schedule?.subject || "Chi tiết điểm danh"}
        rightAction={
          <Link
            to="/student/attendance"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
            Đang tải chi tiết điểm danh...
          </div>
        ) : schedule ? (
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <CalendarDays size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Thông tin buổi học
                  </h3>
                  <p className="text-sm text-slate-500">
                    {schedule.studyDate
                      ? formatVietnameseDate(schedule.studyDate)
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Lớp học phần</span>
                  <span className="font-semibold text-slate-900">
                    {schedule.className}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Thứ/Tiết</span>
                  <span className="font-semibold text-slate-900">
                    {schedule.day}, {schedule.time}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Phòng</span>
                  <span className="font-semibold text-blue-700">
                    {schedule.room}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Mở điểm danh</span>
                  <span className="font-semibold text-slate-900">
                    {formatDateTime(attendanceWindow?.startsAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Đóng điểm danh</span>
                  <span className="font-semibold text-slate-900">
                    {formatDateTime(attendanceWindow?.endsAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-blue-700">
                  <Monitor size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Kết quả điểm danh
                  </h3>
                  <p className="text-sm text-slate-500">
                    Dữ liệu theo buổi lịch phòng máy
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Trạng thái lịch</span>
                  <StatusBadge
                    value={
                      attendanceWindow?.statusLabel ||
                      schedule.status ||
                      "Chưa xác định"
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Trạng thái điểm danh</span>
                  <StatusBadge
                    value={
                      attendance?.attendance_status_label || "Chưa điểm danh"
                    }
                  />
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500">Check-in</span>
                  <span className="font-semibold text-slate-900">
                    {formatDateTime(attendance?.checked_in_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Máy đã điểm danh</span>
                  <span className="font-semibold text-blue-700">
                    {attendance?.computer?.code ||
                      attendance?.computer?.name ||
                      "-"}
                  </span>
                </div>
              </div>

              <form
                onSubmit={handleCheckIn}
                className="mt-5 grid gap-3 border-t border-slate-200 pt-5"
              >
                <label className="grid gap-2 text-sm font-semibold text-slate-700">
                  Chọn máy tính
                  <select
                    value={selectedComputerId}
                    onChange={(event) =>
                      setSelectedComputerId(event.target.value)
                    }
                    disabled={!canCheckIn}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  >
                    <option value="">Chọn máy đang sử dụng</option>
                    {computers.map((computer) => (
                      <option key={computer.id} value={computer.id}>
                        {computer.ma_may} - {computer.ten_may}
                        {computer.vi_tri ? ` (${computer.vi_tri})` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={!canCheckIn || isSubmitting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <ClipboardCheck size={16} />
                  {isSubmitting
                    ? "Đang điểm danh..."
                    : hasCheckedIn
                    ? "Đã điểm danh"
                    : "Điểm danh"}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </SectionCard>
    </AppShell>
  );
}