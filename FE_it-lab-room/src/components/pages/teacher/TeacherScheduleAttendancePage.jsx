import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock3, Search, Users } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatusBadge from "../../common/StatusBadge";
import { getTeacherScheduleAttendanceFromApi } from "../../../services/attendance.service";

const statusLabels = {
  present: "Có mặt",
  late: "Đi trễ",
  absent: "Chưa điểm danh",
};

function formatDate(date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(`${date}T00:00:00`));
}

function mapAttendanceStudent(item) {
  return {
    id: item.student?.id,
    studentCode: item.student?.student_code || "-",
    fullName: item.student?.full_name || "-",
    email: item.student?.email || "-",
    classCode: item.student?.class_code || "-",
    checkedInTime: item.checked_in_time || "-",
    status: statusLabels[item.attendance_status] || item.attendance_status || "Chưa điểm danh",
    computerCode: item.computer?.code || "-",
    computerName: item.computer?.name || "-",
    computerPosition: item.computer?.position || "-",
  };
}

export default function TeacherScheduleAttendancePage() {
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState(null);
  const [summary, setSummary] = useState({
    total_students: 0,
    checked_in_students: 0,
    absent_students: 0,
  });
  const [students, setStudents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getTeacherScheduleAttendanceFromApi(scheduleId)
      .then((response) => {
        if (!isMounted) return;

        setSchedule(response.data?.schedule || null);
        setSummary(response.data?.summary || {
          total_students: 0,
          checked_in_students: 0,
          absent_students: 0,
        });
        setStudents((response.data?.students || []).map(mapAttendanceStudent));
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError?.payload?.message || apiError.message || "Không thể tải danh sách điểm danh.");
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

  const filteredStudents = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      return students;
    }

    return students.filter((student) => {
      const searchContent = [
        student.studentCode,
        student.fullName,
        student.email,
        student.classCode,
        student.status,
        student.computerCode,
        student.computerName,
        student.computerPosition,
      ].join(" ").toLowerCase();

      return searchContent.includes(keyword);
    });
  }, [searchKeyword, students]);

  const subject = schedule?.lop_hoc_phan?.mon_hoc || schedule?.lop_hoc_phan?.ma_lop_hoc_phan || "-";
  const className = schedule?.lop?.ma_lop || schedule?.lop_hoc_phan?.ma_lop_hoc_phan || "-";

  return (
    <AppShell
      role="teacher"
      title="Danh sách sinh viên điểm danh"
      subtitle="Theo dõi sinh viên đã quét QR máy trong buổi học"
    >
      <SectionCard
        title={subject}
        rightAction={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm MSSV, họ tên, máy..."
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
            <Link
              to="/teacher/attendance"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Quay lại
            </Link>
          </div>
        }
      >
        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Lớp</p>
            <p className="mt-2 font-bold text-slate-900">{className}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Ngày học</p>
            <p className="mt-2 font-bold text-slate-900">{formatDate(schedule?.ngay_hoc_cu_the)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Tiết</p>
            <p className="mt-2 font-bold text-slate-900">
              {schedule ? `${schedule.so_tiet_bat_dau} - ${schedule.so_tiet_ket_thuc}` : "-"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Phòng</p>
            <p className="mt-2 font-bold text-blue-700">{schedule?.phong?.ma_phong || "-"}</p>
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Users className="text-blue-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Số lượng</p>
                <p className="text-xl font-bold text-slate-900">{summary.total_students}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Đã điểm danh</p>
                <p className="text-xl font-bold text-slate-900">{summary.checked_in_students}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <Clock3 className="text-amber-700" size={20} />
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Chưa điểm danh</p>
                <p className="text-xl font-bold text-slate-900">{summary.absent_students}</p>
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={[
            { key: "studentCode", title: "MSSV" },
            { key: "fullName", title: "Họ tên" },
            { key: "classCode", title: "Lớp" },
            { key: "checkedInTime", title: "Check-in" },
            { key: "status", title: "Trạng thái", render: (value) => <StatusBadge value={value} /> },
            { key: "computerCode", title: "Mã máy" },
            { key: "computerName", title: "Tên máy" },
            { key: "computerPosition", title: "Vị trí máy" },
          ]}
          data={filteredStudents}
          emptyText={isLoading ? "Đang tải danh sách sinh viên điểm danh" : "Chưa có sinh viên trong buổi học này"}
        />
      </SectionCard>
    </AppShell>
  );
}
