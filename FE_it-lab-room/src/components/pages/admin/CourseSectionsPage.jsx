import { useState } from "react";
import { ListTree } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { classes, rooms, subjects, users } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialCourseSections } from "./adminPageData";

const teacherOptions = users.filter((user) => user.role === "Giảng viên");
const timeSettings = ["2025-2026 HK1", "2025-2026 HK2", "2026-2027 HK1"];
const sectionStatuses = ["Hoạt động", "Tạm dừng", "Hoàn thành"];

export default function CourseSectionsPage() {
  const [items, setItems] = useState(initialCourseSections);
  const [form, setForm] = useState({ code: "", className: classes[0]?.code || "", subject: subjects[0]?.name || "", timeSetting: timeSettings[0], teacher: teacherOptions[0]?.name || "", room: rooms[0]?.code || "", maxStudents: "40", status: "Hoạt động", note: "" });

  const submit = (event) => {
    event.preventDefault();
    if (!form.code.trim()) return;
    appendItem(setItems, { ...form, maxStudents: Number(form.maxStudents) });
    setForm({ ...form, code: "", note: "" });
  };

  return (
    <AppShell role="admin" title="Lớp học phần" subtitle="Quản lý lớp học phần và phân công giảng viên">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo lớp học phần">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Mã lớp học phần"><TextInput value={form.code} onChange={(code) => setForm({ ...form, code })} placeholder="VD: LTWEB-03" /></Field>
            <Field label="Lớp"><SelectInput value={form.className} onChange={(className) => setForm({ ...form, className })}>{classes.map((item) => <option key={item.id} value={item.code}>{item.code}</option>)}</SelectInput></Field>
            <Field label="Môn học"><SelectInput value={form.subject} onChange={(subject) => setForm({ ...form, subject })}>{subjects.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</SelectInput></Field>
            <Field label="Cấu trúc thời gian"><SelectInput value={form.timeSetting} onChange={(timeSetting) => setForm({ ...form, timeSetting })}>{timeSettings.map((item) => <option key={item} value={item}>{item}</option>)}</SelectInput></Field>
            <Field label="Giảng viên"><SelectInput value={form.teacher} onChange={(teacher) => setForm({ ...form, teacher })}>{teacherOptions.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</SelectInput></Field>
            <Field label="Phòng"><SelectInput value={form.room} onChange={(room) => setForm({ ...form, room })}>{rooms.map((item) => <option key={item.id} value={item.code}>{item.code}</option>)}</SelectInput></Field>
            <Field label="Sĩ số tối đa"><TextInput type="number" value={form.maxStudents} onChange={(maxStudents) => setForm({ ...form, maxStudents })} /></Field>
            <Field label="Trạng thái"><SelectInput value={form.status} onChange={(status) => setForm({ ...form, status })}>{sectionStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</SelectInput></Field>
            <Field label="Ghi chú"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><ListTree size={16} />Tạo lớp học phần</button>
          </form>
        </SectionCard>
        <SectionCard title="Danh sách lớp học phần">
          <DataTable columns={[
            { key: "code", title: "Mã LHP" },
            { key: "className", title: "Lớp" },
            { key: "subject", title: "Môn" },
            { key: "timeSetting", title: "Thời gian" },
            { key: "teacher", title: "Giảng viên" },
            { key: "room", title: "Phòng" },
            { key: "maxStudents", title: "Sĩ số tối đa" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "note", title: "Ghi chú" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
