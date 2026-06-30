import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Search, Upload, KeyRound, Lock, Unlock, Loader2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import {
  getUsersFromApi,
  toggleUserStatusFromApi,
  resetUserPasswordFromApi,
  getDepartmentsFromApi,
  deleteUserFromApi,
} from "../../../services/user.service";

// Bộ lọc vai trò hiển thị bên trong trang
const roleTabs = [
  { key: "all", label: "Tất cả tài khoản", roleId: null },
  { key: "Admin", label: "Admin", roleId: 1 },
  { key: "Giảng viên", label: "Giảng viên", roleId: 3 },
  { key: "Sinh viên", label: "Sinh viên", roleId: 2 },
];

// Map vai trò ID sang tên hiển thị
const roleNameMap = { 1: "Admin", 2: "Sinh viên", 3: "Giảng viên" };

const pageConfigByRole = {
  all: {
    title: "Quản lý người dùng",
    subtitle: "Danh sách admin, giảng viên, sinh viên",
    sectionTitle: "Danh sách người dùng",
    codeTitle: "Mã",
    searchPlaceholder: "Tìm theo tên, email hoặc mã",
  },
  Admin: {
    title: "Quản lý người dùng",
    subtitle: "Danh sách tài khoản quản trị viên",
    sectionTitle: "Danh sách Admin",
    codeTitle: "Mã người dùng",
    searchPlaceholder: "Tìm theo tên hoặc email",
  },
  "Giảng viên": {
    title: "Quản lý người dùng",
    subtitle: "Danh sách tài khoản giảng viên",
    sectionTitle: "Danh sách giảng viên",
    codeTitle: "MSGV",
    searchPlaceholder: "Tìm theo tên hoặc MSGV",
  },
  "Sinh viên": {
    title: "Quản lý người dùng",
    subtitle: "Danh sách tài khoản sinh viên",
    sectionTitle: "Danh sách sinh viên",
    codeTitle: "MSSV",
    searchPlaceholder: "Tìm theo tên hoặc MSSV",
  },
};

export default function UsersPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Dữ liệu từ API
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // ID user đang xử lý

  // Thông báo kết quả thao tác
  const [toast, setToast] = useState(null);

  const config = pageConfigByRole[roleFilter];
  const isStudentTab = roleFilter === "Sinh viên";
  const isTeacherTab = roleFilter === "Giảng viên";
  const showCodeColumn = roleFilter !== "all" && roleFilter !== "Admin";

  // Debounce tìm kiếm 400ms để tránh gọi API quá nhiều khi gõ liên tục
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
      setCurrentPage(1); // Reset trang khi search thay đổi
    }, 400);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Hàm fetch danh sách users từ API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const currentTab = roleTabs.find((tab) => tab.key === roleFilter);
      const params = { page: currentPage };

      // Truyền roleId để filter trên backend
      if (currentTab?.roleId) {
        params.role = currentTab.roleId;
      }

      // Truyền keyword tìm kiếm
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const response = await getUsersFromApi(params);

      if (response.status) {
        setUsers(response.data || []);
        setPagination(response.pagination || null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, currentPage, debouncedSearch]);

  // Fetch danh sách phòng ban cho bộ lọc (1 lần duy nhất)
  useEffect(() => {
    getDepartmentsFromApi()
      .then((response) => {
        if (response.status) {
          setDepartments(response.data || []);
        }
      })
      .catch(() => setDepartments([]));
  }, []);

  // Gọi lại API khi thay đổi bộ lọc, trang, hoặc từ khóa tìm kiếm
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Tự ẩn toast sau 3 giây
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Đổi tab vai trò → reset trang và từ khóa
  const handleSelectRoleTab = (key) => {
    setRoleFilter(key);
    setCurrentPage(1);
    setSearchKeyword("");
    setDebouncedSearch("");
  };

  // Xử lý khóa/mở khóa tài khoản
  const handleToggleStatus = async (user) => {
    const actionLabel = user.status === 1 ? "khóa" : "mở khóa";

    if (!window.confirm(`Bạn có chắc muốn ${actionLabel} tài khoản "${user.full_name}"?`)) {
      return;
    }

    setActionLoading(user.id);
    try {
      const response = await toggleUserStatusFromApi(user.id);
      if (response.status) {
        setToast({ type: "success", message: response.message });
        // Cập nhật trạng thái ngay trên UI mà không cần fetch lại
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: response.data.trang_thai } : u)),
        );
      }
    } catch (error) {
      setToast({ type: "error", message: error.message || "Đã có lỗi xảy ra" });
    } finally {
      setActionLoading(null);
    }
  };

  // Xử lý reset mật khẩu
  const handleResetPassword = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn reset mật khẩu cho "${user.full_name}"?\nMật khẩu sẽ được đặt lại về: 123456`)) {
      return;
    }

    setActionLoading(user.id);
    try {
      const response = await resetUserPasswordFromApi(user.id);
      if (response.status) {
        setToast({ type: "success", message: response.message });
      }
    } catch (error) {
      setToast({ type: "error", message: error.message || "Đã có lỗi xảy ra" });
    } finally {
      setActionLoading(null);
    }
  };

  // Xử lý xóa tài khoản
  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn XÓA vĩnh viễn tài khoản "${user.full_name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    setActionLoading(user.id);
    try {
      const response = await deleteUserFromApi(user.id);
      if (response.status) {
        setToast({ type: "success", message: "Đã xóa tài khoản thành công" });
        // Cập nhật lại danh sách sau khi xóa
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (error) {
      setToast({ type: "error", message: error.message || "Lỗi khi xóa tài khoản" });
    } finally {
      setActionLoading(null);
    }
  };

  // Lấy mã hiển thị (MSSV hoặc MSGV) từ dữ liệu API
  const getUserCode = (user) => {
    if (user.student) return user.student.student_code || "-";
    if (user.teacher) return user.teacher.teacher_code || "-";
    return "-";
  };

  // Lấy tên vai trò hiển thị
  const getRoleName = (user) => roleNameMap[user.role_id] || user.role?.role_name || "-";

  // Lấy tên lớp (chỉ sinh viên)
  const getClassName = (user) => user.student?.class_code || "-";

  // Lấy niên khóa (chỉ sinh viên)
  const getCourseYear = (user) => user.student?.course_year || "-";

  // Lấy tên phòng ban (chỉ giảng viên)
  const getDepartmentName = (user) => user.teacher?.department?.department_name || "-";

  // Lấy trạng thái hiển thị
  const getStatusLabel = (user) => (user.status === 1 ? "Hoạt động" : "Tạm khóa");

  const columns = [
    ...(showCodeColumn ? [{ key: "code", title: config.codeTitle, render: (_, user) => getUserCode(user) }] : []),
    { key: "full_name", title: "Họ tên" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Số điện thoại", render: (value) => value || "-" },
    ...(roleFilter === "all" ? [{ key: "role_name", title: "Vai trò", render: (_, user) => getRoleName(user) }] : []),
    ...(isStudentTab ? [{ key: "class_name", title: "Lớp", render: (_, user) => getClassName(user) }] : []),
    ...(isStudentTab ? [{ key: "course_year", title: "Niên khóa", render: (_, user) => getCourseYear(user) }] : []),
    ...(isTeacherTab ? [{ key: "department_name", title: "Phòng ban", render: (_, user) => getDepartmentName(user) }] : []),
    { key: "status", title: "Trạng thái", render: (_, user) => getStatusLabel(user), isStatus: false },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, user) => {
        const isProcessing = actionLoading === user.id;

        return (
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/admin/users/${user.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700 transition hover:bg-amber-200"
            >
              <Edit size={14} />
              Sửa
            </Link>

            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-50"
              disabled={isProcessing}
              onClick={() => handleResetPassword(user)}
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
              Reset MK
            </button>

            {user.status === 1 ? (
              <button
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                disabled={isProcessing}
                onClick={() => handleToggleStatus(user)}
              >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Khóa
              </button>
            ) : (
              <button
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50"
                disabled={isProcessing}
                onClick={() => handleToggleStatus(user)}
              >
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
                Mở khóa
              </button>
            )}

            {/* Nút Xóa vĩnh viễn */}
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 transition hover:bg-rose-200 disabled:opacity-50"
              disabled={isProcessing}
              onClick={() => handleDelete(user)}
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Xóa
            </button>
          </div>
        );
      },
    },
  ];

  // Khi bấm "Thêm", truyền vai trò đang lọc làm vai trò mặc định cho form
  const addPath =
    roleFilter === "all" ? "/admin/users/create" : `/admin/users/create?role=${encodeURIComponent(roleFilter)}`;

  return (
    <AppShell role="admin" title={config.title} subtitle={config.subtitle}>
      {/* Toast thông báo kết quả thao tác */}
      {toast && (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${toast.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Bộ lọc vai trò */}
      <div className="mb-5 flex flex-wrap gap-2">
        {roleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleSelectRoleTab(tab.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${roleFilter === tab.key
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SectionCard
        title={config.sectionTitle}
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
                placeholder={config.searchPlaceholder}
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>

            <Link
              to="/admin/users/create?tab=csv"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Upload size={16} />
              Nhập CSV
            </Link>

            <Link
              to={addPath}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              + Thêm người dùng
            </Link>
          </div>
        }
      >
        {/* Hiển thị loading khi đang fetch */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <span className="ml-3 text-sm text-slate-500">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={users} />

            {/* Phân trang */}
            {pagination && pagination.last_page > 1 && (
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 px-2 pt-4">
                <p className="text-sm text-slate-500">
                  Hiển thị trang <span className="font-semibold">{pagination.current_page}</span> /{" "}
                  <span className="font-semibold">{pagination.last_page}</span> — Tổng{" "}
                  <span className="font-semibold">{pagination.total}</span> tài khoản
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={pagination.current_page <= 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Trước
                  </button>
                  <button
                    type="button"
                    disabled={pagination.current_page >= pagination.last_page}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sau
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </AppShell>
  );
}