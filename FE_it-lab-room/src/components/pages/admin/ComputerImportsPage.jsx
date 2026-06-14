import { useState } from "react";
import { PackagePlus } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialImportDetails, initialImportReceipts, nextCode } from "./adminPageData";

export default function ComputerImportsPage() {
  const [receipts, setReceipts] = useState(initialImportReceipts);
  const [details, setDetails] = useState(initialImportDetails);
  const [form, setForm] = useState({
    code: nextCode("PN", initialImportReceipts),
    computerCode: computers[0]?.code || "",
    date: "2026-05-30",
    quantity: "1",
    supplier: "",
    note: "",
  });

  const submit = (event) => {
    event.preventDefault();
    const existingReceipt = receipts.find((receipt) => receipt.code === form.code);

    if (!existingReceipt) {
      appendItem(setReceipts, {
        code: form.code,
        date: form.date,
        quantity: Number(form.quantity || 0),
        supplier: form.supplier,
        note: form.note,
      });
    } else {
      setReceipts((currentReceipts) => currentReceipts.map((receipt) => {
        if (receipt.code !== form.code) {
          return receipt;
        }

        return {
          ...receipt,
          quantity: Number(receipt.quantity || 0) + 1,
        };
      }));
    }

    appendItem(setDetails, {
      importCode: form.code,
      computerCode: form.computerCode,
      note: form.note,
    });

    setForm({
      ...form,
      computerCode: computers.find((computer) => computer.code !== form.computerCode)?.code || form.computerCode,
      note: "",
    });
  };

  return (
    <AppShell role="admin" title="Phiếu nhập máy" subtitle="Tạo và theo dõi phiếu nhập máy vào phòng máy">
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Tạo phiếu nhập">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Mã phiếu nhập"><TextInput value={form.code} onChange={(code) => setForm({ ...form, code: code.toUpperCase() })} /></Field>
            <Field label="Mã máy"><SelectInput value={form.computerCode} onChange={(computerCode) => setForm({ ...form, computerCode })}>{computers.map((computer) => <option key={computer.id} value={computer.code}>{computer.code} - {computer.name}</option>)}</SelectInput></Field>
            <Field label="Ngày nhập"><TextInput type="date" value={form.date} onChange={(date) => setForm({ ...form, date })} /></Field>
            <Field label="Số lượng"><TextInput type="number" value={form.quantity} onChange={(quantity) => setForm({ ...form, quantity })} /></Field>
            <Field label="Nhà cung cấp"><TextInput value={form.supplier} onChange={(supplier) => setForm({ ...form, supplier })} placeholder="VD: Công ty ABC" /></Field>
            <Field label="Ghi chú"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} placeholder="Ghi chú phiếu nhập" /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><PackagePlus size={16} />Tạo phiếu nhập</button>
          </form>
        </SectionCard>
        <div className="space-y-6">
          <SectionCard title="Danh sách phiếu nhập">
            <DataTable columns={[
              { key: "code", title: "Mã phiếu" },
              { key: "date", title: "Ngày nhập" },
              { key: "quantity", title: "Số lượng" },
              { key: "supplier", title: "Nhà cung cấp" },
              { key: "note", title: "Ghi chú" },
            ]} data={receipts} />
          </SectionCard>
          <SectionCard title="Chi tiết phiếu nhập">
            <DataTable columns={[
              { key: "importCode", title: "Mã phiếu" },
              { key: "computerCode", title: "Mã máy" },
              { key: "note", title: "Ghi chú" },
            ]} data={details} />
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
