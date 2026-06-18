import { useMemo, useState } from "react";
import { Save, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers, loanRequests } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialLoanDetails } from "./adminPageData";

export default function LoanDetailsPage() {
  const [items, setItems] = useState(initialLoanDetails);
  const [searchKeyword, setSearchKeyword] = useState("");
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
  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return items.filter((item) => {
      const searchContent = [item.loanCode, item.target, item.borrowStatus, item.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [items, searchKeyword]);

  return (
    <AppShell role="teacher" title="Chi tiết phiếu mượn" subtitle="Một phiếu mượn có thể gồm nhiều máy tính">
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
        <SectionCard
          title="Chi tiết mượn máy tính"
          rightAction={
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm chi tiết mượn"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          }
        >
          <DataTable columns={[
            { key: "loanCode", title: "Phiếu mượn" },
            { key: "target", title: "Máy tính" },
            { key: "borrowStatus", title: "Tình trạng khi mượn" },
            { key: "note", title: "Ghi chú" },
          ]} data={filteredItems} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
