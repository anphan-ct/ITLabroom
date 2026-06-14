import { useState } from "react";
import { Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers, loanRequests } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialLoanDetails } from "./adminPageData";

export default function LoanDetailsPage() {
  const [items, setItems] = useState(initialLoanDetails);
  const [form, setForm] = useState({
    loanCode: loanRequests[0]?.code || "",
    target: computers[0]?.code || "",
    borrowStatus: "Hoạt động",
    note: "",
  });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, { ...form, targetType: "Máy tính", quantity: 1 });
    setForm({ ...form, note: "" });
  };

  return (
    <AppShell role="admin" title="Chi tiết phiếu mượn" subtitle="Một phiếu mượn có thể gồm nhiều máy tính">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Thêm chi tiết mượn">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Phiếu mượn"><SelectInput value={form.loanCode} onChange={(loanCode) => setForm({ ...form, loanCode })}>{loanRequests.map((request) => <option key={request.id} value={request.code}>{request.code}</option>)}</SelectInput></Field>
            <Field label="Máy tính"><SelectInput value={form.target} onChange={(target) => setForm({ ...form, target })}>{computers.map((computer) => <option key={computer.id} value={computer.code}>{computer.code}</option>)}</SelectInput></Field>
            <Field label="Tình trạng khi mượn"><TextInput value={form.borrowStatus} onChange={(borrowStatus) => setForm({ ...form, borrowStatus })} /></Field>
            <Field label="Ghi chú"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><Save size={16} />Lưu chi tiết</button>
          </form>
        </SectionCard>
        <SectionCard title="Chi tiết mượn máy tính">
          <DataTable columns={[
            { key: "loanCode", title: "Phiếu mượn" },
            { key: "target", title: "Máy tính" },
            { key: "borrowStatus", title: "Tình trạng khi mượn" },
            { key: "note", title: "Ghi chú" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
