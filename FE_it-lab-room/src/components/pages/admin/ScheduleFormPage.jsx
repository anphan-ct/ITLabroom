import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import {
  createComputerLabScheduleFromApi,
  getComputerLabScheduleFromApi,
  getComputerLabScheduleOptionsFromApi,
  updateComputerLabScheduleFromApi,
} from "../../../services/schedules.service";

const scheduleTypes = ["ChinhThuc", "DatPhong", "BoSung"];
const lessonOptions = Array.from({ length: 12 }, (_, index) => index + 1);
const scheduleStatuses = [
  { label: "Đã xếp lịch", value: "scheduled" },
  { label: "Đã hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

const initialForm = {
  studyDate: "",
  day: "",
  roomId: "",
  classId: "",
  courseSectionId: "",
  teacherId: "",
  weekId: "",
  lessonStart: 1,
  lessonEnd: 3,
  scheduleType: "ChinhThuc",
  bookingRequestId: "",
  status: "scheduled",
  note: "",
};

const emptyOptions = {
  rooms: [],
  classes: [],
  course_sections: [],
  teachers: [],
  weeks: [],
};

function getDayLabel(dateValue) {
  if (!dateValue) {
    return "";
  }

  const labels = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  return labels[new Date(`${dateValue}T00:00:00`).getDay()];
}

function mapHistoryToForm(history) {
  return {
    studyDate: history.ngay_hoc_cu_the || "",
    day: history.thu_trong_tuan || "",
    roomId: String(history.ma_phong || ""),
    classId: String(history.ma_lop || ""),
    courseSectionId: String(history.ma_lop_hoc_phan || ""),
    teacherId: String(history.ma_giang_vien || ""),
    weekId: String(history.ma_tuan || ""),
    lessonStart: history.so_tiet_bat_dau || 1,
    lessonEnd: history.so_tiet_ket_thuc || 1,
    scheduleType: history.loai_lich || "ChinhThuc",
    bookingRequestId: String(history.ma_dat_phong_may || ""),
    status: history.trang_thai || "scheduled",
    note: history.ghi_chu || "",
  };
}

function getInitialFormFromOptions(options) {
  const firstWeek = options.weeks[0];

  return {
    ...initialForm,
    studyDate: firstWeek?.start_date || "",
    day: getDayLabel(firstWeek?.start_date),
    roomId: String(options.rooms[0]?.id || ""),
    classId: String(options.classes[0]?.id || ""),
    courseSectionId: String(options.course_sections[0]?.id || ""),
    teacherId: String(options.teachers[0]?.id || ""),
    weekId: String(firstWeek?.id || ""),
  };
}

function getApiErrorMessage(error) {
  const validationErrors = error.payload?.data;

  if (validationErrors && typeof validationErrors === "object") {
    const firstMessages = Object.values(validationErrors)[0];

    if (Array.isArray(firstMessages) && firstMessages[0]) {
      return firstMessages[0];
    }
  }

  return error.message || "Không thể lưu lịch phòng máy.";
}

export default function ScheduleFormPage() {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const isEditing = Boolean(scheduleId);
  const [formData, setFormData] = useState(initialForm);
  const [options, setOptions] = useState(emptyOptions);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const requests = [getComputerLabScheduleOptionsFromApi()];
    if (isEditing) {
      requests.push(getComputerLabScheduleFromApi(scheduleId));
    }

    Promise.all(requests)
      .then(([optionsResponse, historyResponse]) => {
        if (!isMounted) {
          return;
        }

        const nextOptions = optionsResponse.data || emptyOptions;
        setOptions(nextOptions);
        setFormData(
          isEditing
            ? mapHistoryToForm(historyResponse.data)
            : getInitialFormFromOptions(nextOptions),
        );
      })
      .catch((apiError) => {
        if (isMounted) {
          setError(apiError.message || "Không thể tải dữ liệu lịch phòng máy.");
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
  }, [isEditing, scheduleId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ["lessonStart", "lessonEnd"];

    setFormData((currentData) => {
      const nextData = {
        ...currentData,
        [name]: numericFields.includes(name) ? Number(value) : value,
      };

      if (name === "studyDate") {
        const matchedWeek = options.weeks.find((week) => (
          value >= week.start_date && value <= week.end_date
        ));

        nextData.day = getDayLabel(value);
        nextData.weekId = matchedWeek ? String(matchedWeek.id) : currentData.weekId;
      }

      return nextData;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.studyDate
      || !formData.day
      || !formData.roomId
      || !formData.courseSectionId
      || !formData.teacherId
      || !formData.weekId
    ) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc của lịch phòng máy.");
      return;
    }

    if (
      Number(formData.lessonStart) < 1
      || Number(formData.lessonEnd) > 12
      || Number(formData.lessonStart) > Number(formData.lessonEnd)
    ) {
      setError("Khoảng tiết phải từ tiết 1 đến tiết 12 và tiết bắt đầu không được lớn hơn tiết kết thúc.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const payload = {
        ma_phong: Number(formData.roomId),
        ma_lop: formData.classId ? Number(formData.classId) : null,
        ma_lop_hoc_phan: Number(formData.courseSectionId),
        ma_giang_vien: Number(formData.teacherId),
        ma_tuan: Number(formData.weekId),
        ngay_hoc_cu_the: formData.studyDate,
        thu_trong_tuan: formData.day,
        so_tiet_bat_dau: Number(formData.lessonStart),
        so_tiet_ket_thuc: Number(formData.lessonEnd),
        loai_lich: formData.scheduleType,
        ma_dat_phong_may: formData.bookingRequestId ? Number(formData.bookingRequestId) : null,
        trang_thai: formData.status,
        ghi_chu: formData.note || null,
      };

      if (isEditing) {
        await updateComputerLabScheduleFromApi(scheduleId, payload);
      } else {
        await createComputerLabScheduleFromApi(payload);
      }

      navigate("/admin/schedules");
    } catch (apiError) {
      setError(getApiErrorMessage(apiError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell
      role="admin"
      title={isEditing ? "Sửa lịch phòng máy" : "Thêm lịch phòng máy"}
      subtitle="Cập nhật lịch học và lịch sử dụng phòng máy"
    >
      <SectionCard title="Thông tin lịch phòng máy">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            Đang tải dữ liệu lịch phòng máy...
          </div>
        ) : (
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
              <input
                type="text"
                value={formData.day}
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-700 outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Phòng máy</span>
              <select name="roomId" value={formData.roomId} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                <option value="">Chọn phòng máy</option>
                {options.rooms.map((room) => <option key={room.id} value={room.id}>{room.code} - {room.name}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Lớp học phần - Môn học</span>
              <select name="courseSectionId" value={formData.courseSectionId} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                <option value="">Chọn lớp học phần</option>
                {options.course_sections.map((courseSection) => (
                  <option key={courseSection.id} value={courseSection.id}>{courseSection.code} - {courseSection.subject}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Lớp</span>
              <select name="classId" value={formData.classId} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                <option value="">Không chọn lớp</option>
                {options.classes.map((schoolClass) => <option key={schoolClass.id} value={schoolClass.id}>{schoolClass.code}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Giảng viên</span>
              <select name="teacherId" value={formData.teacherId} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                <option value="">Chọn giảng viên</option>
                {options.teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.code} - {teacher.name}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Tuần</span>
              <select name="weekId" value={formData.weekId} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                <option value="">Chọn tuần</option>
                {options.weeks.map((week) => (
                  <option key={week.id} value={week.id}>Tuần {week.number} ({week.start_date} - {week.end_date})</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Loại lịch</span>
              <select name="scheduleType" value={formData.scheduleType} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                {scheduleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Trạng thái</span>
              <select name="status" value={formData.status} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                {scheduleStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Từ tiết</span>
                <select name="lessonStart" value={formData.lessonStart} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                  {lessonOptions.map((lesson) => <option key={lesson} value={lesson}>Tiết {lesson}</option>)}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Đến tiết</span>
                <select name="lessonEnd" value={formData.lessonEnd} onChange={handleChange} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500">
                  {lessonOptions.map((lesson) => <option key={lesson} value={lesson}>Tiết {lesson}</option>)}
                </select>
              </label>
            </div>

            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Ghi chú</span>
              <input type="text" name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú lịch phòng máy" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500" />
            </label>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 lg:col-span-2">{error}</div>
            )}

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
              <Link to="/admin/schedules" className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</Link>
              <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                <Save size={16} />
                {isSaving ? "Đang lưu" : "Lưu lịch"}
              </button>
            </div>
          </form>
        )}
      </SectionCard>
    </AppShell>
  );
}
