import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, FileText, XCircle } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import { loanRequests } from "../../../data/mockData";

const loanStatusOptions = ["Chờ xử lý", "Đã duyệt", "Đang mượn", "Đã trả", "Từ chối"];

export default function LoanRequestsManagePage() {
  const [requests, setRequests] = useState(loanRequests);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    return statusFilter === "all"
      ? requests
      : requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const updateRequestStatus = (requestId, status) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === requestId ? { ...request, status } : request,
      ),
    );
  };

  return (
    <AppShell role="admin" title="Quản lý phiếu mượn" subtitle="Theo dõi và xử lý phiếu mượn thiết bị phòng máy">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng phiếu" value={requests.length.toString().padStart(2, "0")} desc="Phiếu mượn trong hệ thống" icon={<FileText size={22} />} />
        <StatCard title="Đang mượn" value={requests.filter((item) => item.status === "Đang mượn").length.toString().padStart(2, "0")} desc="Cần theo dõi hạn trả" icon={<ClipboardList size={22} />} />
        <StatCard title="Đã trả" value={requests.filter((item) => item.status === "Đã trả").length.toString().padStart(2, "0")} desc="Phiếu đã hoàn tất" icon={<CheckCircle2 size={22} />} />
      </div>

      <div className="mt-6">
        <SectionCard
          title="Danh sách phiếu mượn"
          rightAction={
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Đang mượn">Đang mượn</option>
              <option value="Đã trả">Đã trả</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          }
        >
          <DataTable
            columns={[
              { key: "code", title: "Mã phiếu" },
              { key: "borrower", title: "Người mượn" },
              { key: "className", title: "Lớp" },
              { key: "room", title: "Phòng" },
              { key: "item", title: "Thiết bị" },
              { key: "quantity", title: "SL" },
              { key: "expectedReturnAt", title: "Hạn trả" },
              { key: "status", title: "Trạng thái", isStatus: true },
              {
                key: "actions",
                title: "Thao tác",
                render: (_, request) => (
                  <div className="flex gap-2">
                    <select
                      value={request.status}
                      onChange={(event) => updateRequestStatus(request.id, event.target.value)}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none"
                      aria-label="Cập nhật trạng thái phiếu mượn"
                    >
                      {loanStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={request.status === "Đã duyệt"}
                      onClick={() => updateRequestStatus(request.id, "Đã duyệt")}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CheckCircle2 size={15} />
                      Duyệt
                    </button>
                    <button
                      type="button"
                      disabled={request.status === "Từ chối"}
                      onClick={() => updateRequestStatus(request.id, "Từ chối")}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Từ chối
                    </button>
                  </div>
                ),
              },
            ]}
            data={filteredRequests}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
