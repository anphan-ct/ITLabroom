export const initialImportReceipts = [
  { id: 1, code: "PN-0001", quantity: 2, supplier: "Công ty ABC", date: "2026-05-01", note: "Nhập máy thực hành web" },
];

export const initialImportDetails = [
  { id: 1, importCode: "PN-0001", computerCode: "PC001", computerName: "Máy 01", room: "PM01", note: "Máy thực hành web" },
  { id: 2, importCode: "PN-0001", computerCode: "PC002", computerName: "Máy 02", room: "PM01", note: "Máy thực hành web" },
];

export const initialLoanDetails = [
  { id: 1, loanCode: "PM-0001", targetType: "Máy tính", target: "PC001", quantity: 1, borrowStatus: "Hoạt động", note: "Máy dùng trình chiếu" },
];

export const initialReturnReceipts = [
  { id: 1, code: "PT-0001", loanCode: "PM-0002", returnedAt: "2026-05-03 17:00", quantity: 3 },
];

export const initialReturnDetails = [
  { id: 1, returnCode: "PT-0001", targetType: "Máy tính", target: "PC001", quantity: 1, returnStatus: "Hoạt động bình thường", note: "Không phát sinh hư hỏng" },
];

export const initialCourseSections = [
  { id: 1, code: "LTWEB-01", subject: "Lập trình web", academicYear: "2025-2026", teacher: "Trần Thị B", room: "PM01", maxStudents: 40, status: "Hoạt động", note: "Lớp thực hành web" },
  { id: 2, code: "CSDL-02", subject: "Cơ sở dữ liệu", academicYear: "2025-2026", teacher: "Hoàng Minh Khang", room: "PM02", maxStudents: 38, status: "Hoạt động", note: "Lớp thực hành cơ sở dữ liệu" },
];

export const initialRepairLogs = [
  { id: 1, reportCode: "SC-0001", target: "PC002", startedAt: "2026-04-22 09:00", completedAt: "2026-04-22 10:30", content: "Thay nguồn máy tính", processingStatus: "Đã xử lý", cost: "450000" },
];

export const initialMaintenanceTickets = [
  {
    id: 1,
    reportId: 1,
    assignee: "Nguyễn Văn A",
    maintenanceType: "Sửa phần cứng",
    startDate: "2026-04-22",
    endDate: "2026-04-22",
    resolution: "Thay nguồn máy tính",
    cost: "450000",
    status: "completed",
  },
];

export const initialTransfers = [
  { id: 1, computer: "PC021", fromRoom: "PM03", toRoom: "PM01", movedBy: "Nguyễn Văn A", movedAt: "2026-05-02 08:30", reason: "Bổ sung máy cho ca thực hành", note: "Đã cập nhật sơ đồ phòng" },
];

export const initialStatusLogs = [
  { id: 1, computer: "PC002", updater: "Nguyễn Văn A", oldStatus: "Hoạt động", newStatus: "Hỏng", note: "Không khởi động được", createdAt: "2026-04-20 08:00" },
];

export const statusOptions = ["Hoạt động", "Tạm khóa"];

export function nextCode(prefix, items) {
  return `${prefix}-${String(items.length + 1).padStart(4, "0")}`;
}

export function appendItem(setItems, item) {
  setItems((currentItems) => [{ id: Math.max(0, ...currentItems.map((current) => current.id)) + 1, ...item }, ...currentItems]);
}
