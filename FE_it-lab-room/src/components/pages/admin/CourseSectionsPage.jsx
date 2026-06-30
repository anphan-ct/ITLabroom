import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import {
  deleteCourseSectionFromApi,
  getCourseSectionsFromApi,
} from "../../../services/courseSection.service";

const statusLabels = {
  active: "Hoạt động",
  paused: "Tạm dừng",
  completed: "Hoàn thành",
};

function mapCourseSection(item) {
  return {
    id: item.id,
    code: item.ma_lop_hoc_phan,
    subject: item.mon_hoc?.ten_mon || "",
    academicYear: item.nam_hoc?.ten_nam_hoc || "",
    classCode: item.lop?.ma_lop || "Không gắn lớp",
    teacher: item.giang_vien?.ho_ten || "Chưa phân công",
    room: item.phong?.ma_phong || "Chưa xếp phòng",
    studentCount: item.so_sinh_vien ?? 0,
    maxStudents: item.si_so_toi_da,
    status: statusLabels[item.trang_thai] || item.trang_thai,
    note: item.ghi_chu || "",
  };
}

export default function CourseSectionsPage() {
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getCourseSectionsFromApi()
      .then((response) => {
        if (isMounted) {
          setItems((response.data || []).map(mapCourseSection));
        }
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải danh sách lớp học phần.");
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
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return items.filter((item) => {
      const searchContent = [
        item.code, item.subject, item.academicYear, item.classCode, item.teacher,
        item.room, item.status, item.note,
      ].join(" ").toLowerCase();

      return !keyword || searchContent.includes(keyword);
    });
  }, [items, searchKeyword]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Xóa lớp học phần ${item.code}?`)) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setDeletingId(item.id);

    try {
      await deleteCourseSectionFromApi(item.id);
      setItems((currentItems) => currentItems.filter((courseSection) => courseSection.id !== item.id));
      setSuccessMessage(`Đã xóa lớp học phần ${item.code}.`);
    } catch (apiError) {
      setError(apiError.message || "Không thể xóa lớp học phần.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell role="admin" title="Lớp học phần" subtitle="Quản lý lớp học phần và phân công giảng viên">
      <SectionCard
        title="Danh sách lớp học phần"
        rightAction={(
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm lớp học phần"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
            <Link
              to="/admin/course-sections/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={17} />
              Thêm lớp học phần
            </Link>
          </div>
        )}
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
            { key: "code", title: "Mã LHP" },
            { key: "subject", title: "Môn" },
            { key: "academicYear", title: "Năm học" },
            { key: "classCode", title: "Lớp" },
            { key: "teacher", title: "Giảng viên" },
            { key: "room", title: "Phòng" },
            { key: "studentCount", title: "Sinh viên" },
            { key: "maxStudents", title: "Sĩ số tối đa" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "note", title: "Ghi chú" },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, item) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/course-sections/${item.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                  >
                    <Edit size={14} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <Trash2 size={14} />
                    {deletingId === item.id ? "Đang xóa" : "Xóa"}
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredItems}
          getRowLink={(item) => `/admin/course-sections/${item.id}/students`}
          emptyText={isLoading ? "Đang tải danh sách lớp học phần" : "Chưa có lớp học phần"}
        />
      </SectionCard>
    </AppShell>
  );
}
