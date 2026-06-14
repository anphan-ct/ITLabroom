import { useState } from "react";
import { Plus } from "lucide-react";
import { rooms, users } from "../../data/mockData";

const teacherOptions = users.filter((user) => user.role === "Giảng viên");
const departmentOptions = Array.from(
  new Map(
    users
      .filter((user) => user.faculty)
      .map((user, index) => [
        user.faculty,
        {
          id: index + 1,
          name: user.faculty,
        },
      ]),
  ).values(),
);

const initialFormData = {
  teacherId: "",
  departmentId: "",
  roomId: "",
  borrowedAt: "",
  quantity: "1",
  purpose: "",
};

export default function LoanRequestForm({
  onCreate,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");

  const updateFormField = (field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.teacherId
      || !formData.departmentId
      || !formData.roomId
      || !formData.borrowedAt
      || Number(formData.quantity) <= 0
      || !formData.purpose.trim()
    ) {
      setFormError("Vui lòng nhập đầy đủ thông tin phiếu mượn.");
      return;
    }

    const selectedTeacher = teacherOptions.find((teacher) => teacher.id === Number(formData.teacherId));
    const selectedDepartment = departmentOptions.find((department) => department.id === Number(formData.departmentId));
    const selectedRoom = rooms.find((room) => room.id === Number(formData.roomId));

    onCreate({
      teacherId: selectedTeacher.id,
      teacher: selectedTeacher.name,
      departmentId: selectedDepartment.id,
      department: selectedDepartment.name,
      roomId: selectedRoom.id,
      room: selectedRoom.code,
      borrowedAt: formData.borrowedAt.replace("T", " "),
      quantity: Number(formData.quantity),
      reason: formData.purpose.trim(),
    });

    setFormData(initialFormData);
    setFormError("");
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <select
        value={formData.teacherId}
        onChange={(event) => updateFormField("teacherId", event.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      >
        <option value="">Chọn giảng viên mượn</option>
        {teacherOptions.map((teacher) => (
          <option key={teacher.id} value={teacher.id}>
            {teacher.name}
          </option>
        ))}
      </select>
      <select
        value={formData.departmentId}
        onChange={(event) => updateFormField("departmentId", event.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      >
        <option value="">Chọn phòng ban mượn</option>
        {departmentOptions.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>
      <select
        value={formData.roomId}
        onChange={(event) => updateFormField("roomId", event.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      >
        <option value="">Chọn phòng máy</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.code} - {room.name}
          </option>
        ))}
      </select>
      <input
        type="datetime-local"
        value={formData.borrowedAt}
        onChange={(event) => updateFormField("borrowedAt", event.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
      />
      <input
        type="number"
        min="1"
        value={formData.quantity}
        onChange={(event) => updateFormField("quantity", event.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        placeholder="Số lượng máy mượn"
      />
      <textarea
        value={formData.purpose}
        onChange={(event) => updateFormField("purpose", event.target.value)}
        className="min-h-[110px] rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
        placeholder="Lý do mượn..."
      />
      {formError && <p className="text-sm font-medium text-rose-600">{formError}</p>}
      <button
        type="submit"
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        <Plus size={18} />
        Tạo phiếu mượn
      </button>
    </form>
  );
}
