import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { computers, rooms, users } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialTransfers } from "./adminPageData";

export default function ComputerTransfersPage() {
  const [items, setItems] = useState(initialTransfers);
  const [form, setForm] = useState({ computer: computers[0]?.code || "", fromRoom: rooms[0]?.code || "", toRoom: rooms[1]?.code || "", movedBy: users[0]?.name || "", movedAt: "2026-05-30T08:00", reason: "", note: "" });

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, { ...form, movedAt: form.movedAt.replace("T", " ") });
    setForm({ ...form, reason: "", note: "" });
  };

  return (
    <AppShell role="admin" title="Điều chuyển máy" subtitle="Theo dõi lịch sử chuyển máy giữa các phòng">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Tạo điều chuyển">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Máy tính"><SelectInput value={form.computer} onChange={(computer) => setForm({ ...form, computer })}>{computers.map((computer) => <option key={computer.id} value={computer.code}>{computer.code}</option>)}</SelectInput></Field>
            <Field label="Phòng cũ"><SelectInput value={form.fromRoom} onChange={(fromRoom) => setForm({ ...form, fromRoom })}>{rooms.map((room) => <option key={room.id} value={room.code}>{room.code}</option>)}</SelectInput></Field>
            <Field label="Phòng mới"><SelectInput value={form.toRoom} onChange={(toRoom) => setForm({ ...form, toRoom })}>{rooms.map((room) => <option key={room.id} value={room.code}>{room.code}</option>)}</SelectInput></Field>
            <Field label="Người điều chuyển"><SelectInput value={form.movedBy} onChange={(movedBy) => setForm({ ...form, movedBy })}>{users.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}</SelectInput></Field>
            <Field label="Thời gian"><TextInput type="datetime-local" value={form.movedAt} onChange={(movedAt) => setForm({ ...form, movedAt })} /></Field>
            <Field label="Lý do"><TextInput value={form.reason} onChange={(reason) => setForm({ ...form, reason })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><ArrowRightLeft size={16} />Lưu điều chuyển</button>
          </form>
        </SectionCard>
        <SectionCard title="Lịch sử điều chuyển">
          <DataTable columns={[
            { key: "computer", title: "Máy" },
            { key: "fromRoom", title: "Phòng cũ" },
            { key: "toRoom", title: "Phòng mới" },
            { key: "movedBy", title: "Người chuyển" },
            { key: "movedAt", title: "Thời gian" },
            { key: "reason", title: "Lý do" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
