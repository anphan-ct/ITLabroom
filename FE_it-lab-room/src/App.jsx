import { Navigate, Route, Routes } from "react-router-dom";
import StudentLogin from "./components/pages/student/StudentLogin.jsx";
import AdminLogin from "./components/pages/admin/AdminLogin.jsx"
import TeacherLogin from "./components/pages/teacher/TeacherLogin.jsx"
import { ProtectedRoute, PublicOnlyRoute } from "./components/common/ProtectedRoute.jsx";
import AdminDashboard from "./components/pages/admin/AdminDashboard.jsx";
import UsersPage from "./components/pages/admin/UsersPage.jsx";
import UserFormPage from "./components/pages/admin/UserFormPage.jsx";
import ClassesPage from "./components/pages/admin/ClassesPage.jsx";
import ClassFormPage from "./components/pages/admin/ClassFormPage.jsx";
import ClassStudentsPage from "./components/pages/admin/ClassStudentsPage.jsx";
import SubjectsPage from "./components/pages/admin/SubjectsPage.jsx";
import SubjectFormPage from "./components/pages/admin/SubjectFormPage.jsx";
import RoomsPage from "./components/pages/admin/RoomsPage.jsx";
import RoomFormPage from "./components/pages/admin/RoomFormPage.jsx";
import ComputersPage from "./components/pages/admin/ComputersPage.jsx";
import ComputerCreatePage from "./components/pages/admin/ComputerCreatePage.jsx";
import ComputerConfigDetailPage from "./components/pages/admin/ComputerConfigDetailPage.jsx";
import ComputerConfigEditPage from "./components/pages/admin/ComputerConfigEditPage.jsx";
import MaintenancePage from "./components/pages/admin/MaintenancePage.jsx";
import SchedulesPage from "./components/pages/admin/SchedulesPage.jsx";
import ScheduleFormPage from "./components/pages/admin/ScheduleFormPage.jsx";
import LoanRequestsManagePage from "./components/pages/admin/LoanRequestsManagePage.jsx";
import RoomBookingsManagePage from "./components/pages/admin/RoomBookingsManagePage.jsx";
import ShiftFormPage from "./components/pages/admin/ShiftFormPage.jsx";

import TeacherDashboard from "./components/pages/teacher/TeacherDashboard.jsx";
import TeacherSchedulePage from "./components/pages/teacher/TeacherSchedulePage.jsx";
import AttendancePage from "./components/pages/teacher/AttendancePage.jsx";
import TeacherAttendanceSessionStatusPage from "./components/pages/teacher/TeacherAttendanceSessionStatusPage.jsx";
import TeacherStudentAttendanceDetailPage from "./components/pages/teacher/TeacherStudentAttendanceDetailPage.jsx";
import RoomBookingPage from "./components/pages/teacher/RoomBookingPage.jsx";
import IncidentPage from "./components/common/IncidentPage.jsx";

import StudentDashboard from "./components/pages/student/StudentDashboard.jsx";
import StudentSchedulePage from "./components/pages/student/StudentSchedulePage.jsx";
import ComputerLookupPage from "./components/pages/student/ComputerLookupPage.jsx";
import StudentIncidentPage from "./components/pages/student/StudentIncidentPage.jsx";
import StudentAttendancePage from "./components/pages/student/StudentAttendancePage.jsx";
import StudentAttendanceDetailPage from "./components/pages/student/StudentAttendanceDetailPage.jsx";
import StudentAttendanceClassHistoryPage from "./components/pages/student/StudentAttendanceClassHistoryPage.jsx";
import LoanRequestPage from "./components/pages/student/LoanRequestPage.jsx";
import ShiftsPage from "./components/pages/admin/ShiftsPage.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/student/login" replace />} />

      <Route path="/student/login" element={<PublicOnlyRoute role="student"><StudentLogin /></PublicOnlyRoute>} />
      <Route path="/teacher/login" element={<PublicOnlyRoute role="teacher"><TeacherLogin /></PublicOnlyRoute>} />
      <Route path="/admin/login" element={<PublicOnlyRoute role="admin"><AdminLogin /></PublicOnlyRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><UsersPage /></ProtectedRoute>} />
      <Route path="/admin/users/create" element={<ProtectedRoute role="admin"><UserFormPage /></ProtectedRoute>} />
      <Route path="/admin/users/:userId/edit" element={<ProtectedRoute role="admin"><UserFormPage /></ProtectedRoute>} />
      <Route path="/admin/users/students" element={<ProtectedRoute role="admin"><UsersPage type="students" /></ProtectedRoute>} />
      <Route path="/admin/users/students/create" element={<ProtectedRoute role="admin"><UserFormPage defaultRole="Sinh viên" /></ProtectedRoute>} />
      <Route path="/admin/users/teachers" element={<ProtectedRoute role="admin"><UsersPage type="teachers" /></ProtectedRoute>} />
      <Route path="/admin/users/teachers/create" element={<ProtectedRoute role="admin"><UserFormPage defaultRole="Giảng viên" /></ProtectedRoute>} />
      <Route path="/admin/courses/*" element={<ProtectedRoute role="admin"><Navigate to="/admin/classes" replace /></ProtectedRoute>} />
      <Route path="/admin/classes" element={<ProtectedRoute role="admin"><ClassesPage /></ProtectedRoute>} />
      <Route path="/admin/classes/create" element={<ProtectedRoute role="admin"><ClassFormPage /></ProtectedRoute>} />
      <Route path="/admin/classes/:classId/edit" element={<ProtectedRoute role="admin"><ClassFormPage /></ProtectedRoute>} />
      <Route path="/admin/classes/:classId/students" element={<ProtectedRoute role="admin"><ClassStudentsPage /></ProtectedRoute>} />
      <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><SubjectsPage /></ProtectedRoute>} />
      <Route path="/admin/subjects/create" element={<ProtectedRoute role="admin"><SubjectFormPage /></ProtectedRoute>} />
      <Route path="/admin/subjects/:subjectId/edit" element={<ProtectedRoute role="admin"><SubjectFormPage /></ProtectedRoute>} />
      <Route path="/admin/rooms" element={<ProtectedRoute role="admin"><RoomsPage /></ProtectedRoute>} />
      <Route path="/admin/rooms/create" element={<ProtectedRoute role="admin"><RoomFormPage /></ProtectedRoute>} />
      <Route path="/admin/rooms/:roomId/edit" element={<ProtectedRoute role="admin"><RoomFormPage /></ProtectedRoute>} />
      <Route path="/admin/computers" element={<ProtectedRoute role="admin"><ComputersPage /></ProtectedRoute>} />
      <Route path="/admin/computers/create" element={<ProtectedRoute role="admin"><ComputerCreatePage /></ProtectedRoute>} />
      <Route path="/admin/computers/:computerCode/config" element={<ProtectedRoute role="admin"><ComputerConfigDetailPage /></ProtectedRoute>} />
      <Route path="/admin/computers/:computerCode/config/edit" element={<ProtectedRoute role="admin"><ComputerConfigEditPage /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute role="admin"><MaintenancePage /></ProtectedRoute>} />
      <Route path="/admin/schedules" element={<ProtectedRoute role="admin"><SchedulesPage /></ProtectedRoute>} />
      <Route path="/admin/schedules/create" element={<ProtectedRoute role="admin"><ScheduleFormPage /></ProtectedRoute>} />
      <Route path="/admin/schedules/:scheduleId/edit" element={<ProtectedRoute role="admin"><ScheduleFormPage /></ProtectedRoute>} />
      <Route path="/admin/loan-requests" element={<ProtectedRoute role="admin"><LoanRequestsManagePage /></ProtectedRoute>} />
      <Route path="/admin/room-bookings" element={<ProtectedRoute role="admin"><RoomBookingsManagePage /></ProtectedRoute>} />
      <Route path="/admin/shifts" element={<ProtectedRoute role="admin"><ShiftsPage /></ProtectedRoute>} />
      <Route path="/admin/shifts/create" element={<ProtectedRoute role="admin"><ShiftFormPage /></ProtectedRoute>} />
      <Route path="/admin/shifts/:shiftId/edit" element={<ProtectedRoute role="admin"><ShiftFormPage /></ProtectedRoute>} />
      <Route path="/admin/computer-configs" element={<ProtectedRoute role="admin"><Navigate to="/admin/computers" replace /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/schedules" element={<ProtectedRoute role="teacher"><TeacherSchedulePage /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><AttendancePage /></ProtectedRoute>} />
      <Route path="/teacher/attendance/sessions/:sessionId" element={<ProtectedRoute role="teacher"><TeacherAttendanceSessionStatusPage /></ProtectedRoute>} />
      <Route path="/teacher/attendance/students/:studentId" element={<ProtectedRoute role="teacher"><TeacherStudentAttendanceDetailPage /></ProtectedRoute>} />
      <Route
        path="/teacher/incidents"
        element={
          <ProtectedRoute role="teacher">
            <IncidentPage
              role="teacher"
              title="Báo cáo sự cố"
              subtitle="Giảng viên gửi lỗi máy tính hoặc thiết bị"
              sectionTitle="Tạo báo cáo sự cố mới"
            />
          </ProtectedRoute>
        }
      />
      <Route path="/teacher/bookings" element={<ProtectedRoute role="teacher"><RoomBookingPage /></ProtectedRoute>} />

      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/schedules" element={<ProtectedRoute role="student"><StudentSchedulePage /></ProtectedRoute>} />
      <Route path="/student/computers" element={<ProtectedRoute role="student"><ComputerLookupPage /></ProtectedRoute>} />
      <Route path="/student/incidents" element={<ProtectedRoute role="student"><StudentIncidentPage /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendancePage /></ProtectedRoute>} />
      <Route path="/student/attendance/history" element={<ProtectedRoute role="student"><Navigate to="/student/attendance" replace /></ProtectedRoute>} />
      <Route path="/student/attendance/history/:classCode" element={<ProtectedRoute role="student"><StudentAttendanceClassHistoryPage /></ProtectedRoute>} />
      <Route path="/student/attendance/:scheduleId" element={<ProtectedRoute role="student"><StudentAttendanceDetailPage /></ProtectedRoute>} />
      <Route path="/student/loan-requests" element={<ProtectedRoute role="student"><LoanRequestPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
