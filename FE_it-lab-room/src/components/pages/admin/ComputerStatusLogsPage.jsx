import { useState } from "react";
import { History } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers, users } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialStatusLogs } from "./adminPageData";

const computerStatusOptions = ["Hoạt động", "Hỏng", "Bảo trì", "Ngừng sử dụng"];

export default function ComputerStatusLogsPage() {
  const [items, setItems] = useState(initialStatusLogs);
  const [form, setForm] = useState({ computer: computers[0]?.code || "", updater: users[0]?.name || "", oldStatus: "Hoạt động", newStatus: "Bảo trì", note: "", createdAt: "2026-05-30T08:00" });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, { ...form, createdAt: form.createdAt.replace("T", " ") });
    setForm({ ...form, note: "" });
  };

  return (
    <AppShell role="admin" title="Nhật ký trạng thái máy" subtitle="Ghi nhận lịch sử thay đổi trạng thái máy tính">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Cập nhật trạng thái">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Máy tính"><SelectInput value={form.computer} onChange={(computer) => setForm({ ...form, computer })}>{computers.map((computer) => <option key={computer.id} value={computer.code}>{computer.code}</option>)}</SelectInput></Field>
            <Field label="Người cập nhật"><SelectInput value={form.updater} onChange={(updater) => setForm({ ...form, updater })}>{users.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}</SelectInput></Field>
            <Field label="Trạng thái cũ"><SelectInput value={form.oldStatus} onChange={(oldStatus) => setForm({ ...form, oldStatus })}>{computerStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</SelectInput></Field>
            <Field label="Trạng thái mới"><SelectInput value={form.newStatus} onChange={(newStatus) => setForm({ ...form, newStatus })}>{computerStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</SelectInput></Field>
            <Field label="Thời gian"><TextInput type="datetime-local" value={form.createdAt} onChange={(createdAt) => setForm({ ...form, createdAt })} /></Field>
            <Field label="Mô tả"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><History size={16} />Lưu nhật ký</button>
          </form>
        </SectionCard>
        <SectionCard title="Lịch sử trạng thái">
          <DataTable columns={[
            { key: "computer", title: "Máy" },
            { key: "updater", title: "Người cập nhật" },
            { key: "oldStatus", title: "Trạng thái cũ" },
            { key: "newStatus", title: "Trạng thái mới", isStatus: true },
            { key: "createdAt", title: "Thời gian" },
            { key: "note", title: "Mô tả" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
