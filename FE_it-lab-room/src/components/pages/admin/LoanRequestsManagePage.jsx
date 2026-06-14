import { useState } from "react";
import { FileText } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import LoanRequestForm from "../../common/LoanRequestForm";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import { loanRequests } from "../../../data/mockData";

const normalizeLoanRequest = (request) => ({
  ...request,
  teacher: request.teacher || request.teacherName,
  department: request.department || request.departmentName,
  room: request.room || request.roomCode,
  borrowedAt: request.borrowedAt,
  reason: request.reason || request.purpose,
});

export default function LoanRequestsManagePage() {
  const [requests, setRequests] = useState(() => loanRequests.map(normalizeLoanRequest));

  const createLoanRequest = (loanRequestData) => {
    setRequests((currentRequests) => {
      const nextId = Math.max(0, ...currentRequests.map((request) => request.id)) + 1;

      return [
        {
          id: nextId,
          code: `PM-${String(nextId).padStart(4, "0")}`,
          ...loanRequestData,
        },
        ...currentRequests,
      ];
    });
  };

  return (
    <AppShell role="admin" title="Quản lý phiếu mượn" subtitle="Tạo, theo dõi và xử lý phiếu mượn thiết bị phòng máy">
      <div className="grid gap-4 md:grid-cols-1">
        <StatCard title="Tổng phiếu" value={requests.length.toString().padStart(2, "0")} desc="Phiếu mượn trong hệ thống" icon={<FileText size={22} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)]">
        <SectionCard title="Tạo phiếu mượn">
          <LoanRequestForm onCreate={createLoanRequest} />
        </SectionCard>

        <SectionCard title="Danh sách phiếu mượn">
          <DataTable
            columns={[
              { key: "code", title: "Mã phiếu" },
              { key: "teacher", title: "Giảng viên" },
              { key: "department", title: "Phòng ban" },
              { key: "room", title: "Phòng máy" },
              { key: "quantity", title: "Số lượng" },
              { key: "borrowedAt", title: "Ngày mượn" },
              { key: "reason", title: "Lý do mượn" },
            ]}
            data={requests}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
