import { useState } from "react";
import { Wrench } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { incidentReports, users } from "../../../data/mockData";
import { appendItem, initialMaintenanceTickets } from "./adminPageData";
import { Field, SelectInput, TextInput } from "./adminFormControls";

const ticketStatusOptions = ["pending", "processing", "completed", "cancelled"];

export default function MaintenanceTicketsPage() {
  const [tickets, setTickets] = useState(initialMaintenanceTickets);
  const [ticketForm, setTicketForm] = useState({
    reportId: incidentReports[0]?.id || "",
    assignee: users[0]?.name || "",
    maintenanceType: "Sửa phần cứng",
    startDate: "2026-05-30",
    endDate: "",
    resolution: "",
    cost: "0",
    status: "pending",
  });
  const selectedReport = incidentReports.find((report) => Number(report.id) === Number(ticketForm.reportId));

  const createMaintenanceTicket = (event) => {
    event.preventDefault();

    appendItem(setTickets, {
      ...ticketForm,
      reportId: Number(ticketForm.reportId),
      cost: Number(ticketForm.cost || 0).toString(),
    });
    setTicketForm({
      ...ticketForm,
      resolution: "",
      cost: "0",
      status: "pending",
    });
  };

  const getReportLabel = (reportId) => {
    const report = incidentReports.find((item) => Number(item.id) === Number(reportId));

    return report ? `#${report.id} - ${report.title}` : `#${reportId}`;
  };

  return (
    <AppShell role="admin" title="Phiếu bảo trì" subtitle="Lập phiếu bảo trì từ báo cáo sự cố và theo dõi xử lý">
      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Tạo phiếu bảo trì">
          <form onSubmit={createMaintenanceTicket} className="grid gap-4">
            <Field label="Báo cáo sự cố">
              <SelectInput value={ticketForm.reportId} onChange={(reportId) => setTicketForm({ ...ticketForm, reportId })}>
                {incidentReports.map((report) => (
                  <option key={report.id} value={report.id}>
                    #{report.id} - {report.title}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{selectedReport?.target || "Chưa chọn báo cáo"}</div>
              <div>{selectedReport?.issueType || "-"}</div>
            </div>
            <Field label="Người phụ trách"><SelectInput value={ticketForm.assignee} onChange={(assignee) => setTicketForm({ ...ticketForm, assignee })}>{users.map((user) => <option key={user.id} value={user.name}>{user.name}</option>)}</SelectInput></Field>
            <Field label="Loại bảo trì"><TextInput value={ticketForm.maintenanceType} onChange={(maintenanceType) => setTicketForm({ ...ticketForm, maintenanceType })} /></Field>
            <Field label="Ngày bắt đầu"><TextInput type="date" value={ticketForm.startDate} onChange={(startDate) => setTicketForm({ ...ticketForm, startDate })} /></Field>
            <Field label="Ngày kết thúc"><TextInput type="date" value={ticketForm.endDate} onChange={(endDate) => setTicketForm({ ...ticketForm, endDate })} /></Field>
            <Field label="Cách xử lý"><TextInput value={ticketForm.resolution} onChange={(resolution) => setTicketForm({ ...ticketForm, resolution })} /></Field>
            <Field label="Chi phí"><TextInput type="number" value={ticketForm.cost} onChange={(cost) => setTicketForm({ ...ticketForm, cost })} /></Field>
            <Field label="Trạng thái"><SelectInput value={ticketForm.status} onChange={(status) => setTicketForm({ ...ticketForm, status })}>{ticketStatusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</SelectInput></Field>
            <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white"><Wrench size={16} />Lưu phiếu</button>
          </form>
        </SectionCard>

        <SectionCard title="Danh sách phiếu bảo trì">
          <DataTable columns={[
            { key: "id", title: "ID phiếu" },
            { key: "reportId", title: "Báo cáo", render: (value) => getReportLabel(value) },
            { key: "assignee", title: "Người phụ trách" },
            { key: "maintenanceType", title: "Loại bảo trì" },
            { key: "startDate", title: "Bắt đầu" },
            { key: "endDate", title: "Kết thúc" },
            { key: "resolution", title: "Cách xử lý" },
            { key: "cost", title: "Chi phí" },
            { key: "status", title: "Trạng thái", isStatus: true },
          ]} data={tickets} />
        </SectionCard>
      </div>
    </AppShell>
  );
}
