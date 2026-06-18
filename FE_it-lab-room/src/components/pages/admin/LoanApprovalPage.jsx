import { useMemo, useState } from "react";
import { CheckCircle, Search, XCircle } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { loanRequests } from "../../../data/mockData";

function normalizeLoanRequest(request) {
  return {
    ...request,
    teacher: request.teacher || request.teacherName,
    department: request.department || request.departmentName,
    room: request.room || request.roomCode,
    borrowedAt: request.borrowedAt,
    reason: request.reason || request.purpose,
    status: request.status || "Chờ duyệt",
  };
}

export default function LoanApprovalPage() {
  const [requests, setRequests] = useState(() => loanRequests.map(normalizeLoanRequest));
  const [searchKeyword, setSearchKeyword] = useState("");

  const updateStatus = (requestId, status) => {
    setRequests((currentRequests) => {
      return currentRequests.map((request) => {
        return request.id === requestId ? { ...request, status } : request;
      });
    });
  };

  const filteredRequests = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return requests.filter((request) => {
      const searchContent = [
        request.code,
        request.teacher,
        request.department,
        request.room,
        request.quantity,
        request.borrowedAt,
        request.reason,
        request.status,
      ].join(" ").toLowerCase();

      return !keyword || searchContent.includes(keyword);
    });
  }, [requests, searchKeyword]);

  return (
    <AppShell role="admin" title="Duyệt phiếu mượn máy" subtitle="Xem và xử lý phiếu mượn máy do giảng viên gửi">
      <SectionCard
        title="Danh sách phiếu mượn chờ duyệt"
        rightAction={
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm phiếu mượn"
              className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
            />
          </div>
        }
      >
        <DataTable
          columns={[
            { key: "code", title: "Mã phiếu" },
            { key: "teacher", title: "Giảng viên" },
            { key: "department", title: "Phòng ban" },
            { key: "room", title: "Phòng máy" },
            { key: "quantity", title: "Số lượng" },
            { key: "borrowedAt", title: "Ngày mượn" },
            { key: "reason", title: "Lý do mượn" },
            { key: "status", title: "Trạng thái", isStatus: true },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, request) => (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(request.id, "Đã duyệt")}
                    disabled={request.status === "Đã duyệt"}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <CheckCircle size={14} />
                    Duyệt
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(request.id, "Từ chối")}
                    disabled={request.status === "Từ chối"}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <XCircle size={14} />
                    Từ chối
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredRequests}
          emptyText="Chưa có phiếu mượn cần duyệt"
        />
      </SectionCard>
    </AppShell>
  );
}
