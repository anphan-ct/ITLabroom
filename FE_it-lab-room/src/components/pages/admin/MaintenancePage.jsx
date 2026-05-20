import { useState } from "react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { maintenanceTickets } from "../../../data/mockData";

const maintenanceStatusOptions = ["Chờ xử lý", "Đã duyệt", "Đang sửa", "Hoàn thành", "Từ chối"];

export default function MaintenancePage() {
  const [tickets, setTickets] = useState(maintenanceTickets);

  const updateTicketStatus = (ticketId, status) => {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket,
      ),
    );
  };

  return (
    <AppShell role="admin" title="Quản lý bảo trì" subtitle="Theo dõi sự cố và tiến độ xử lý">
      <SectionCard title="Phiếu sửa chữa / bảo trì">
        <DataTable
          columns={[
            { key: "reporter", title: "Người báo" },
            { key: "computer", title: "Máy" },
            { key: "issue", title: "Mô tả lỗi" },
            { key: "date", title: "Ngày báo" },
            { key: "status", title: "Trạng thái", isStatus: true },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, ticket) => (
                <div className="flex gap-2">
                  <select
                    value={ticket.status}
                    onChange={(event) => updateTicketStatus(ticket.id, event.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
                    aria-label="Cập nhật trạng thái bảo trì"
                  >
                    {maintenanceStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={ticket.status === "Đã duyệt"}
                    onClick={() => updateTicketStatus(ticket.id, "Đã duyệt")}
                    className="rounded-lg bg-blue-100 px-3 py-1 text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Duyệt
                  </button>
                  <button
                    type="button"
                    disabled={ticket.status === "Từ chối"}
                    onClick={() => updateTicketStatus(ticket.id, "Từ chối")}
                    className="rounded-lg bg-rose-100 px-3 py-1 text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                </div>
              ),
            },
          ]}
          data={tickets}
        />
      </SectionCard>
    </AppShell>
  );
}
