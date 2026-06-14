import { useState } from "react";
import { ClipboardList, Wrench, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { incidentReports } from "../../../data/mockData";

export default function MaintenancePage() {
  const [reports, setReports] = useState(incidentReports);

  const updateReportStatus = (reportId, status) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId ? { ...report, status } : report,
      ),
    );
  };

  return (
    <AppShell role="admin" title="Báo cáo sự cố" subtitle="Tiếp nhận báo cáo sự cố và chuyển sang phiếu bảo trì khi cần xử lý">
      <div className="space-y-6">
        <SectionCard title="Danh sách báo cáo sự cố">
          <DataTable
            columns={[
              { key: "id", title: "ID" },
              { key: "reporter", title: "Người báo" },
              { key: "targetType", title: "Loại" },
              { key: "target", title: "Đối tượng" },
              { key: "room", title: "Phòng" },
              { key: "issueType", title: "Loại sự cố" },
              { key: "title", title: "Tiêu đề" },
              { key: "severity", title: "Mức độ", isStatus: true },
              { key: "status", title: "Trạng thái", isStatus: true },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, report) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={report.status === "Đã tiếp nhận"}
                      onClick={() => updateReportStatus(report.id, "Đã tiếp nhận")}
                      className="inline-flex h-9 items-center gap-1 rounded-lg bg-blue-100 px-3 text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ClipboardList size={15} />
                      Tiếp nhận
                    </button>
                    <Link
                      to="/admin/maintenance-tickets"
                      onClick={() => updateReportStatus(report.id, "Đang xử lý")}
                      className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-100 px-3 text-emerald-700"
                    >
                      <Wrench size={15} />
                      Lập phiếu
                    </Link>
                    <button
                      type="button"
                      disabled={report.status === "Từ chối"}
                      onClick={() => updateReportStatus(report.id, "Từ chối")}
                      className="inline-flex h-9 items-center gap-1 rounded-lg bg-rose-100 px-3 text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Từ chối
                    </button>
                  </div>
                ),
              },
            ]}
            data={reports}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
