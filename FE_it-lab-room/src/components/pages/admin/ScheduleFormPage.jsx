import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { classes, rooms, shifts, subjects, users } from "../../../data/mockData";
import { addSchedulesForShifts, getSchedules, upsertSchedule } from "../../../data/schedulesStore";

const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

const initialForm = {
  studyDate: "2026-06-08",
  weekNumber: 1,
  day: "Thứ 2",
  shift: "Ca sáng",
  time: "06:30 - 11:25",
  room: "PM01",
  subject: "Lập trình web",
  className: "CNTT01",
  teacher: "Trần Thị B",
  lessonStart: 1,
  lessonEnd: 3,
  scheduleType: "ChinhThuc",
  status: "scheduled",
  note: "",
};

const lessonRanges = {
  "Ca sáng": { min: 1, max: 6 },
  "Ca chiều": { min: 7, max: 12 },
};
const scheduleTypes = ["ChinhThuc", "DatPhong", "BoSung"];
const scheduleStatuses = ["scheduled", "completed", "cancelled"];

function hasLessonOverlap(firstSchedule, secondSchedule) {
  return Number(firstSchedule.lessonStart) <= Number(secondSchedule.lessonEnd)
    && Number(secondSchedule.lessonStart) <= Number(firstSchedule.lessonEnd);
}

export default function ScheduleFormPage() {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const isEditing = Boolean(scheduleId);
  const schedules = useMemo(() => getSchedules(), []);
  const editingSchedule = isEditing
    ? schedules.find((schedule) => schedule.id === Number(scheduleId))
    : null;
  const [formData, setFormData] = useState(editingSchedule || initialForm);
  const [selectedShifts, setSelectedShifts] = useState([editingSchedule?.shift || initialForm.shift]);
  const [error, setError] = useState("");
  const teacherOptions = users.filter((user) => user.role === "Giảng viên");

  if (isEditing && !editingSchedule) {
    return <Navigate to="/admin/schedules" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ["weekNumber", "lessonStart", "lessonEnd"];

    setFormData((currentData) => ({
      ...currentData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleShiftChange = (shift) => {
    const range = lessonRanges[shift.name];

    setSelectedShifts([shift.name]);
    setFormData((currentData) => ({
      ...currentData,
      shift: shift.name,
      time: shift.time,
      lessonStart: range?.min || currentData.lessonStart,
      lessonEnd: range?.max || currentData.lessonEnd,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.studyDate || !formData.day || selectedShifts.length === 0 || !formData.room || !formData.subject || !formData.className || !formData.teacher || !formData.lessonStart || !formData.lessonEnd) {
      setError("Vui lòng nhập đầy đủ thông tin lịch phòng máy.");
      return;
    }

    if (Number(formData.lessonStart) > Number(formData.lessonEnd)) {
      setError("Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc.");
      return;
    }

    const invalidLessonRange = selectedShifts.some((shiftName) => {
      const range = lessonRanges[shiftName];

      return range && (Number(formData.lessonStart) < range.min || Number(formData.lessonEnd) > range.max);
    });

    if (invalidLessonRange) {
      setError("Tiết học không nằm trong khoảng hợp lệ của ca đã chọn.");
      return;
    }

    const duplicatedRoomSchedule = schedules.some((schedule) => {
      return schedule.id !== editingSchedule?.id
        && schedule.studyDate === formData.studyDate
        && selectedShifts.includes(schedule.shift)
        && schedule.room === formData.room
        && hasLessonOverlap(schedule, formData);
    });

    if (duplicatedRoomSchedule) {
      setError("Phòng máy đã có lịch trùng ngày học, ca học và khoảng tiết.");
      return;
    }

    if (isEditing) {
      const selectedShift = shifts.find((shift) => shift.name === selectedShifts[0]);
      upsertSchedule({
        ...formData,
        id: editingSchedule?.id,
        shift: selectedShift.name,
        time: selectedShift.time,
      });
    } else {
      addSchedulesForShifts(formData, selectedShifts, shifts);
    }

    navigate("/admin/schedules");
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lịch phòng máy" : "Thêm lịch phòng máy"}
      subtitle="Cập nhật lịch học và lịch sử dụng phòng máy"
    >
      <SectionCard title="Thông tin lịch phòng máy">
        <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Ngày học cụ thể</span>
            <input
              type="date"
              name="studyDate"
              value={formData.studyDate}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Thứ</span>
            <select
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Ca học</span>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shifts.map((shift) => (
                <label
                  key={shift.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <input
                    type="radio"
                    name="shift"
                    checked={selectedShifts.includes(shift.name)}
                    onChange={() => handleShiftChange(shift)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>{shift.name} - {shift.time}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Phòng máy</span>
            <select
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.code}>
                  {room.code} - {room.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Môn học</span>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Lớp</span>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.code}>
                  {schoolClass.code} - {schoolClass.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Giảng viên</span>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Tuần</span>
            <input
              type="number"
              name="weekNumber"
              min="1"
              max="20"
              value={formData.weekNumber}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Loại lịch</span>
            <select
              name="scheduleType"
              value={formData.scheduleType}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {scheduleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Trạng thái</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              {scheduleStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tiết bắt đầu</span>
              <input
                type="number"
                name="lessonStart"
                min="1"
                max="12"
                value={formData.lessonStart}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tiết kết thúc</span>
              <input
                type="number"
                name="lessonEnd"
                min="1"
                max="12"
                value={formData.lessonEnd}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </label>
          </div>

          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
            <input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Ghi chú lịch phòng máy"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to="/admin/schedules"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu lịch
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
