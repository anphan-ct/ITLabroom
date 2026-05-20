export const users = [
  { id: 1, name: "Nguyễn Văn A", email: "a@itlab.vn", role: "Admin", faculty: "Công nghệ thông tin", status: "Hoạt động" },
  { id: 2, name: "Trần Thị B", code: "GV001", email: "b@itlab.vn", role: "Giảng viên", faculty: "Công nghệ thông tin", status: "Hoạt động" },
  { id: 3, name: "Lê Văn C", code: "SV001", email: "c@itlab.vn", role: "Sinh viên", studentRole: 0, faculty: "Công nghệ thông tin", classId: 2, className: "CNTT02", course: "2023-2027", status: "Tạm khóa" },
  { id: 4, name: "Phạm Minh D", code: "SV002", email: "monitor@itlab.vn", role: "Sinh viên", studentRole: 1, faculty: "Công nghệ thông tin", classId: 1, className: "CNTT01", course: "2022-2026", status: "Hoạt động" },
  { id: 5, name: "Hoàng Minh Khang", code: "GV002", email: "khang@itlab.vn", role: "Giảng viên", faculty: "Điện tử viễn thông", status: "Hoạt động" },
  { id: 6, name: "Ngô Thảo Vy", code: "SV003", email: "vy@itlab.vn", role: "Sinh viên", studentRole: 0, faculty: "Điện tử viễn thông", classId: 2, className: "CNTT02", course: "2023-2027", status: "Hoạt động" },
];

export const classes = [
  { id: 1, code: "CNTT01", name: "Công nghệ thông tin 01", courseYear: "2022-2026", size: 42, advisor: "Trần Thị B" },
  { id: 2, code: "CNTT02", name: "Công nghệ thông tin 02", courseYear: "2023-2027", size: 40, advisor: "Hoàng Minh Khang" },
];

export const subjects = [
  { id: 1, code: "LTWEB", name: "Lập trình web", credits: 3 },
  { id: 2, code: "CSDL", name: "Cơ sở dữ liệu", credits: 3 },
  { id: 3, code: "MMT", name: "Mạng máy tính", credits: 2 },
];

export const shifts = [
  { id: 1, code: "SANG", name: "Ca sáng", time: "06:30 - 11:25" },
  { id: 2, code: "CHIEU", name: "Ca chiều", time: "12:30 - 17:30" },
];

export const rooms = [
  { id: 1, code: "PM01", name: "Phòng máy 01", location: "Tầng 2", computers: 35, status: "Đang sử dụng" },
  { id: 2, code: "PM02", name: "Phòng máy 02", location: "Tầng 3", computers: 40, status: "Sẵn sàng" },
  { id: 3, code: "PM03", name: "Phòng máy 03", location: "Tầng 3", computers: 30, status: "Bảo trì" },
];

export const computers = [
  { id: 1, code: "PC001", name: "Máy 01", room: "PM01", ip: "192.168.10.11", mac: "A0-B1-C2-D3-E4-01", cpu: "Core i5", ram: "8GB", storage: "256GB SSD", status: "Hoạt động" },
  { id: 2, code: "PC002", name: "Máy 02", room: "PM01", ip: "192.168.10.12", mac: "A0-B1-C2-D3-E4-02", cpu: "Core i5", ram: "8GB", storage: "256GB SSD", status: "Hỏng" },
  { id: 3, code: "PC015", name: "Máy 15", room: "PM02", ip: "192.168.20.25", mac: "A0-B1-C2-D3-E4-15", cpu: "Core i7", ram: "16GB", storage: "512GB SSD", status: "Hoạt động" },
  { id: 4, code: "PC021", name: "Máy 21", room: "PM03", ip: "192.168.30.31", mac: "A0-B1-C2-D3-E4-21", cpu: "Ryzen 5", ram: "8GB", storage: "256GB SSD", status: "Bảo trì" },
];

export const maintenanceTickets = [
  { id: 1, reporter: "GV Trần Thị B", computer: "PC002", issue: "Không khởi động được", date: "2026-04-20", status: "Chờ xử lý" },
  { id: 2, reporter: "SV Lê Văn C", computer: "PC021", issue: "Màn hình bị nhấp nháy", date: "2026-04-21", status: "Đang sửa" },
  { id: 3, reporter: "Admin", computer: "PC010", issue: "Bàn phím hỏng", date: "2026-04-22", status: "Hoàn thành" },
];

export const schedules = [
  {
    id: 1,
    day: "Thứ 2",
    shift: "Ca sáng",
    time: "06:30 - 11:25",
    room: "PM01",
    subject: "Lập trình web",
    className: "CNTT01",
    teacher: "Trần Thị B",
    weekNumber: 1,
    lessonStart: 1,
    lessonEnd: 3,
  },
  {
    id: 2,
    day: "Thứ 3",
    shift: "Ca chiều",
    time: "12:30 - 17:30",
    room: "PM02",
    subject: "Cơ sở dữ liệu",
    className: "CNTT02",
    teacher: "Nguyễn Văn A",
    weekNumber: 2,
    lessonStart: 7,
    lessonEnd: 9,
  },
];

export const attendance = [
  { id: 1, studentId: "SV001", name: "Nguyễn Văn Nam", className: "CNTT01", status: "Có mặt" },
  { id: 2, studentId: "SV002", name: "Trần Thị Lan", className: "CNTT01", status: "Vắng" },
  { id: 3, studentId: "SV003", name: "Lê Quốc Huy", className: "CNTT01", status: "Có mặt" },
];

export const teacherAttendanceSessions = [
  {
    id: 1,
    scheduleId: 1,
    title: "Điểm danh buổi thực hành",
    openedAt: "07:00",
    status: "Đang mở",
  },
  {
    id: 2,
    scheduleId: 2,
    title: "Điểm danh buổi học",
    openedAt: "09:00",
    status: "Đang mở",
  },
];

export const attendanceHistories = [
  {
    id: 1,
    subject: "Lập trình web",
    className: "CNTT01",
    day: "Thứ 2",
    time: "07:00 - 09:00",
    room: "PM01",
    checkedInAt: "07:05",
    status: "Có mặt",
  },
  {
    id: 2,
    subject: "Cơ sở dữ liệu",
    className: "CNTT02",
    day: "Thứ 3",
    time: "09:00 - 11:00",
    room: "PM02",
    checkedInAt: "09:12",
    status: "Đi trễ",
  },
];

export const loanRequests = [
  {
    id: 1,
    code: "PM-0001",
    borrower: "Phạm Minh D",
    className: "CNTT01",
    item: "Laptop thực hành",
    room: "PM01",
    quantity: 1,
    borrowedAt: "2026-05-04 07:00",
    expectedReturnAt: "2026-05-04 11:00",
    purpose: "Hỗ trợ nhóm làm bài thực hành mạng máy tính",
    status: "Đang mượn",
  },
  {
    id: 2,
    code: "PM-0002",
    borrower: "Lê Văn C",
    className: "CNTT02",
    item: "Máy chiếu",
    room: "PM02",
    quantity: 1,
    borrowedAt: "2026-05-03 13:00",
    expectedReturnAt: "2026-05-03 17:00",
    purpose: "Trình bày báo cáo môn Cơ sở dữ liệu",
    status: "Đã trả",
  },
];

export const dashboardStats = {
  totalRooms: 3,
  totalComputers: 105,
  brokenComputers: 7,
  todaySchedules: 6,
};
