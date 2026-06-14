import { useState } from "react";
import { Building2, ClipboardList, Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialDepartments, statusOptions } from "./adminPageData";

export default function DepartmentsPage() {
  const [items, setItems] = useState(initialDepartments);
  const [form, setForm] = useState({ code: "", name: "", status: "Hoạt động", note: "" });

  const submit = (event) => {
    event.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    appendItem(setItems, form);
    setForm({ code: "", name: "", status: "Hoạt động", note: "" });
  };

  return (
    <AppShell role="admin" title="Quản lý phòng ban" subtitle="Danh mục phòng ban dùng cho giảng viên và phiếu mượn">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng phòng ban" value={items.length.toString().padStart(2, "0")} desc="Đơn vị trong hệ thống" icon={<Building2 size={22} />} />
        <StatCard title="Hoạt động" value={items.filter((item) => item.status === "Hoạt động").length.toString().padStart(2, "0")} desc="Đang sử dụng" icon={<ClipboardList size={22} />} />
        <StatCard title="Tạm khóa" value={items.filter((item) => item.status !== "Hoạt động").length.toString().padStart(2, "0")} desc="Ngừng sử dụng" icon={<ClipboardList size={22} />} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Thêm phòng ban">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Mã phòng ban"><TextInput value={form.code} onChange={(code) => setForm({ ...form, code })} placeholder="VD: CNTT" /></Field>
            <Field label="Tên phòng ban"><TextInput value={form.name} onChange={(name) => setForm({ ...form, name })} placeholder="VD: Công nghệ thông tin" /></Field>
            <Field label="Trạng thái">
              <SelectInput value={form.status} onChange={(status) => setForm({ ...form, status })}>
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
              </SelectInput>
            </Field>
            <Field label="Mô tả"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} placeholder="Ghi chú phòng ban" /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><Save size={16} />Lưu phòng ban</button>
          </form>
        </SectionCard>
        <SectionCard title="Danh sách phòng ban">
          <DataTable columns={[
            { key: "code", title: "Mã" },
            { key: "name", title: "Tên phòng ban" },
            { key: "status", title: "Trạng thái", isStatus: true },
            { key: "note", title: "Mô tả" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
