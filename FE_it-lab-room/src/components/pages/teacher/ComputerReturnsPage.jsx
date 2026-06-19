import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { loanRequests } from "../../../data/mockData";
import { getAuthSession } from "../../../services/auth.service";
import { Field, SelectInput, TextInput } from "../admin/adminFormControls";
import { appendItem, initialReturnReceipts, nextCode } from "../admin/adminPageData";

export default function ComputerReturnsPage() {
  const currentUser = getAuthSession()?.user;
  const [receipts, setReceipts] = useState(initialReturnReceipts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form, setForm] = useState({ loanCode: loanRequests[0]?.code || "", returnedAt: "2026-05-30T08:00", quantity: "1", note: "" });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setReceipts, {
      code: nextCode("PT", receipts),
      ...form,
      teacher: currentUser?.full_name || "",
      quantity: Number(form.quantity || 0),
      returnedAt: form.returnedAt.replace("T", " "),
    });
  };
  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return receipts.filter((receipt) => {
      const searchContent = [receipt.code, receipt.loanCode, receipt.teacher, receipt.returnedAt, receipt.quantity, receipt.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [receipts, searchKeyword]);

  return (
    <AppShell role="teacher" title="Phiếu trả máy" subtitle="Ghi nhận trả máy đã mượn">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo phiếu trả">
          <form onSubmit={submit} className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{currentUser?.full_name || "Chưa xác định giảng viên"}</div>
              <div className="mt-1">
                {currentUser?.teacher?.department?.department_name || "Tài khoản giảng viên chưa có phòng ban"}
              </div>
            </div>
            <Field label="Phiếu mượn"><SelectInput value={form.loanCode} onChange={(loanCode) => setForm({ ...form, loanCode })}>{loanRequests.map((request) => <option key={request.id} value={request.code}>{request.code}</option>)}</SelectInput></Field>
            <Field label="Ngày trả"><TextInput type="datetime-local" value={form.returnedAt} onChange={(returnedAt) => setForm({ ...form, returnedAt })} /></Field>
            <Field label="Số lượng trả"><TextInput type="number" value={form.quantity} onChange={(quantity) => setForm({ ...form, quantity })} /></Field>
            <Field label="Ghi chú"><TextInput value={form.note} onChange={(note) => setForm({ ...form, note })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><RotateCcw size={16} />Tạo phiếu trả</button>
          </form>
        </SectionCard>
        <SectionCard
          title="Danh sách phiếu trả"
          rightAction={
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm phiếu trả"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          }
        >
          <DataTable columns={[
            { key: "code", title: "Mã phiếu" },
            { key: "loanCode", title: "Phiếu mượn" },
            { key: "teacher", title: "Giảng viên" },
            { key: "returnedAt", title: "Ngày trả" },
            { key: "quantity", title: "Số lượng" },
            { key: "note", title: "Ghi chú" },
          ]} data={filteredReceipts} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
