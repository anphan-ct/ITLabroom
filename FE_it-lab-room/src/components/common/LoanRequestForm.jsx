import { useState } from "react";
import { Plus } from "lucide-react";
import { rooms } from "../../data/mockData";
import { getAuthSession } from "../../services/auth.service";

const initialFormData = {
  roomId: "",
  borrowedAt: "",
  quantity: "1",
  purpose: "",
};

export default function LoanRequestForm({
  onCreate,
}) {
  const currentUser = getAuthSession()?.user;
  const teacherProfile = currentUser?.teacher;
  const teacherDepartment = teacherProfile?.department;
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
      !teacherProfile?.id
      || !teacherDepartment?.id
      || !formData.roomId
      || !formData.borrowedAt
      || Number(formData.quantity) <= 0
      || !formData.purpose.trim()
    ) {
      setFormError("Vui lòng nhập đầy đủ thông tin phiếu mượn.");
      return;
    }

    const selectedRoom = rooms.find((room) => room.id === Number(formData.roomId));

    onCreate({
      teacherId: teacherProfile.id,
      teacher: currentUser.full_name,
      departmentId: teacherDepartment.id,
      department: teacherDepartment.department_name,
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
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <div className="font-semibold text-slate-900">{currentUser?.full_name || "Chưa xác định giảng viên"}</div>
        <div className="mt-1">
          {teacherDepartment?.department_name || "Tài khoản giảng viên chưa có phòng ban"}
        </div>
      </div>
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
