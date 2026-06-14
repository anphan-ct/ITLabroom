import { useState } from "react";
import { RotateCcw } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialReturnDetails, initialReturnReceipts } from "./adminPageData";

export default function ComputerReturnDetailsPage() {
  const [items, setItems] = useState(initialReturnDetails);
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

  return (
    <AppShell role="admin" title="Chi tiết trả máy" subtitle="Một phiếu trả có thể gồm nhiều máy tính">
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

        <SectionCard title="Chi tiết trả máy tính">
          <DataTable
            columns={[
              { key: "returnCode", title: "Phiếu trả" },
              { key: "target", title: "Máy tính" },
              { key: "returnStatus", title: "Tình trạng khi trả" },
              { key: "note", title: "Ghi chú" },
            ]}
            data={items}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
