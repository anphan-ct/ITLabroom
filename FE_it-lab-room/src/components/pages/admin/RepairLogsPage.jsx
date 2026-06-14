import { useState } from "react";
import { Wrench } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { incidentReports } from "../../../data/mockData";
import { Field, SelectInput, TextInput } from "./adminFormControls";
import { appendItem, initialMaintenanceTickets, initialRepairLogs } from "./adminPageData";

const resultOptions = ["Đang xử lý", "Đã xử lý", "Không sửa được", "Cần thay thế"];

export default function RepairLogsPage() {
  const normalizedInitialLogs = initialRepairLogs.map((log) => ({
    ...log,
    maintenanceTicketId: 1,
    reportId: 1,
    repairTime: log.startedAt,
    repairContent: log.content,
    result: log.processingStatus,
  }));
  const [items, setItems] = useState(normalizedInitialLogs);
  const [tickets] = useState(initialMaintenanceTickets);
  const [form, setForm] = useState({ maintenanceTicketId: tickets[0]?.id || "", repairTime: "2026-05-30T08:00", repairContent: "", result: "Đang xử lý", cost: "0" });
  const selectedTicket = tickets.find((ticket) => Number(ticket.id) === Number(form.maintenanceTicketId)) || tickets[0];
  const selectedReport = incidentReports.find((report) => Number(report.id) === Number(selectedTicket?.reportId));

  const changeTicket = (maintenanceTicketId) => {
    setForm({ ...form, maintenanceTicketId });
  };

  const submit = (event) => {
    event.preventDefault();
    appendItem(setItems, {
      ...form,
      maintenanceTicketId: Number(form.maintenanceTicketId),
      reportId: selectedTicket?.reportId || "",
      target: selectedReport?.target || "",
      repairTime: form.repairTime.replace("T", " "),
    });
    setForm({ ...form, repairContent: "", cost: "0" });
  };

  return (
    <AppShell role="admin" title="Nhật ký sửa chữa" subtitle="Ghi nhận từng lần sửa chữa máy tính và thiết bị">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Thêm nhật ký">
          <form onSubmit={submit} className="grid gap-4">
            <Field label="Phiếu bảo trì">
              <SelectInput value={form.maintenanceTicketId} onChange={changeTicket}>
                {tickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    Phiếu #{ticket.id} - Báo cáo #{ticket.reportId}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{selectedReport?.target}</div>
              <div>Báo cáo #{selectedReport?.id} - {selectedReport?.title}</div>
            </div>
            <Field label="Thời gian sửa"><TextInput type="datetime-local" value={form.repairTime} onChange={(repairTime) => setForm({ ...form, repairTime })} /></Field>
            <Field label="Nội dung sửa"><TextInput value={form.repairContent} onChange={(repairContent) => setForm({ ...form, repairContent })} /></Field>
            <Field label="Kết quả">
              <SelectInput value={form.result} onChange={(result) => setForm({ ...form, result })}>
                {resultOptions.map((result) => (
                  <option key={result} value={result}>{result}</option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Chi phí"><TextInput type="number" value={form.cost} onChange={(cost) => setForm({ ...form, cost })} /></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><Wrench size={16} />Lưu nhật ký</button>
          </form>
        </SectionCard>
        <SectionCard title="Danh sách nhật ký sửa chữa">
          <DataTable columns={[
            { key: "maintenanceTicketId", title: "ID phiếu bảo trì", render: (value) => `#${value}` },
            { key: "reportId", title: "ID báo cáo", render: (value) => value ? `#${value}` : "-" },
            { key: "target", title: "Đối tượng" },
            { key: "repairTime", title: "Thời gian sửa" },
            { key: "repairContent", title: "Nội dung sửa" },
            { key: "result", title: "Kết quả", isStatus: true },
            { key: "cost", title: "Chi phí" },
          ]} data={items} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
