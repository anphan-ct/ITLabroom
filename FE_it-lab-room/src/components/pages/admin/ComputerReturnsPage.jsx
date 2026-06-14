import { useState } from "react";
import { RotateCcw } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { loanRequests, users } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialReturnReceipts, nextCode } from "./adminPageData";

export default function ComputerReturnsPage() {
  const [receipts, setReceipts] = useState(initialReturnReceipts);
  const [form, setForm] = useState({ loanCode: loanRequests[0]?.code || "", teacher: "", returnedAt: "2026-05-30T08:00", quantity: "1", note: "" });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setReceipts, {
      code: nextCode("PT", receipts),
      ...form,
      quantity: Number(form.quantity || 0),
      returnedAt: form.returnedAt.replace("T", " "),
    });
  };

  return (
    <AppShell role="admin" title="Phiếu trả máy" subtitle="Ghi nhận trả máy đã mượn">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo phiếu trả">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Phiếu mượn"><SelectInput value={form.loanCode} onChange={(loanCode) => setForm({ ...form, loanCode })}>{loanRequests.map((request) => <option key={request.id} value={request.code}>{request.code}</option>)}</SelectInput></Field>
            <Field label="Giảng viên trả"><SelectInput value={form.teacher} onChange={(teacher) => setForm({ ...form, teacher })}><option value="">Không chọn</option>{users.filter((user) => user.role === "Giảng viên").map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}</SelectInput></Field>
            <Field label="Ngày trả"><TextInput type="datetime-local" value={form.returnedAt} onChange={(returnedAt) => setForm({ ...form, returnedAt })} /></Field>
            <Field label="Số lượng trả"><TextInput type="number" value={form.quantity} onChange={(quantity) => setForm({ ...form, quantity })} /></Field>
            <Field label="Ghi chú"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><RotateCcw size={16} />Tạo phiếu trả</button>
          </form>
        </SectionCard>
        <SectionCard title="Danh sách phiếu trả">
          <DataTable columns={[
            { key: "code", title: "Mã phiếu" },
            { key: "loanCode", title: "Phiếu mượn" },
            { key: "teacher", title: "Giảng viên" },
            { key: "returnedAt", title: "Ngày trả" },
            { key: "quantity", title: "Số lượng" },
            { key: "note", title: "Ghi chú" },
          ]} data={receipts} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
