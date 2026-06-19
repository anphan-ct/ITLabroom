import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialReturnDetails, initialReturnReceipts } from "./adminPageData";

export default function ComputerReturnDetailsPage() {
  const [items, setItems] = useState(initialReturnDetails);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form, setForm] = useState({
    returnCode: initialReturnReceipts[0]?.code || "",
    target: computers[0]?.code || "",
    returnStatus: "",
    note: "",
  });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, { ...form, targetType: "Máy tính", quantity: 1 });
    setForm({ ...form, returnStatus: "", note: "" });
  };
  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return items.filter((item) => {
      const searchContent = [item.returnCode, item.target, item.returnStatus, item.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [items, searchKeyword]);

  return (
    <AppShell role="teacher" title="Chi tiết trả máy" subtitle="Một phiếu trả có thể gồm nhiều máy tính">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Thêm chi tiết trả">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Phiếu trả">
              <SelectInput value={form.returnCode} onChange={(returnCode) => setForm({ ...form, returnCode })}>
                {initialReturnReceipts.map((receipt) => (
                  <option key={receipt.id} value={receipt.code}>{receipt.code}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Máy tính">
              <SelectInput value={form.target} onChange={(target) => setForm({ ...form, target })}>
                {computers.map((computer) => (
                  <option key={computer.id} value={computer.code}>{computer.code}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Tình trạng khi trả">
              <TextInput value={form.returnStatus} onChange={(returnStatus) => setForm({ ...form, returnStatus })} />
            </Field>
            <Field label="Ghi chú sau khi mượn">
              <TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} />
            </Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white">
              <RotateCcw size={16} />
              Lưu chi tiết
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Chi tiết trả máy tính"
          rightAction={
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm chi tiết trả"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          }
        >
          <DataTable
            columns={[
              { key: "returnCode", title: "Phiếu trả" },
              { key: "target", title: "Máy tính" },
              { key: "returnStatus", title: "Tình trạng khi trả" },
              { key: "note", title: "Ghi chú" },
            ]}
            data={filteredItems}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
