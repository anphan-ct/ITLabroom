import { useMemo, useState } from "react";
import { ArrowRightLeft, Search } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers, rooms } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialTransfers } from "./adminPageData";

export default function ComputerTransfersPage() {
  const [items, setItems] = useState(initialTransfers);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form, setForm] = useState({ computer: computers[0]?.code || "", toRoom: rooms[1]?.code || "", movedAt: "2026-05-30T08:00", reason: "", note: "" });
  const selectedComputer = computers.find((computer) => computer.code === form.computer);
  const fromRoom = selectedComputer?.room || "";

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, { ...form, fromRoom, movedAt: form.movedAt.replace("T", " ") });
    setForm({ ...form, reason: "", note: "" });
  };
  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return items.filter((item) => {
      const searchContent = [item.computer, item.fromRoom, item.toRoom, item.movedAt, item.reason, item.note].join(" ").toLowerCase();
      return !keyword || searchContent.includes(keyword);
    });
  }, [items, searchKeyword]);

  return (
    <AppShell role="admin" title="Điều chuyển máy" subtitle="Theo dõi lịch sử chuyển máy giữa các phòng">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo điều chuyển">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Máy tính"><SelectInput value={form.computer} onChange={(computer) => setForm({ ...form, computer })}>{computers.map((computer) => <option key={computer.id} value={computer.code}>{computer.code}</option>)}</SelectInput></Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-700">Phòng cũ: </span>
              <span className="text-slate-900">{fromRoom || "Chưa xác định"}</span>
            </div>
            <Field label="Phòng mới"><SelectInput value={form.toRoom} onChange={(toRoom) => setForm({ ...form, toRoom })}>{rooms.map((room) => <option key={room.id} value={room.code}>{room.code}</option>)}</SelectInput></Field>
            <Field label="Thời gian"><TextInput type="datetime-local" value={form.movedAt} onChange={(movedAt) => setForm({ ...form, movedAt })} /></Field>
            <Field label="Lý do"><TextInput value={form.reason} onChange={(reason) => setForm({ ...form, reason })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><ArrowRightLeft size={16} />Lưu điều chuyển</button>
          </form>
        </SectionCard>
        <SectionCard
          title="Lịch sử điều chuyển"
          rightAction={
            <div className="relative">
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm điều chuyển"
                className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          }
        >
          <DataTable columns={[
            { key: "computer", title: "Máy" },
            { key: "fromRoom", title: "Phòng cũ" },
            { key: "toRoom", title: "Phòng mới" },
            { key: "movedAt", title: "Thời gian" },
            { key: "reason", title: "Lý do" },
          ]} data={filteredItems} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
