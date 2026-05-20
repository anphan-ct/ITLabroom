import { ClipboardList, FileText, Send } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import { loanRequests } from "../../../data/mockData";

export default function LoanRequestPage() {
  return (
    <AppShell role="student" title="Phiếu mượn thiết bị" subtitle="Lớp trưởng tạo và theo dõi phiếu mượn thiết bị phòng máy">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Tổng phiếu" value={loanRequests.length.toString().padStart(2, "0")} desc="Phiếu mượn đã tạo" icon={<FileText size={22} />} />
        <StatCard title="Đang mượn" value={loanRequests.filter((item) => item.status === "Đang mượn").length.toString().padStart(2, "0")} desc="Cần theo dõi trả thiết bị" icon={<ClipboardList size={22} />} />
        <StatCard title="Đã trả" value={loanRequests.filter((item) => item.status === "Đã trả").length.toString().padStart(2, "0")} desc="Phiếu đã hoàn tất" icon={<Send size={22} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <SectionCard title="Tạo phiếu mượn mới">
          <div className="grid gap-4">
            <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Họ tên" />
            <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Lớp" />
            <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none">
              <option>Chọn phòng máy</option>
              <option>PM01</option>
              <option>PM02</option>
              <option>PM03</option>
            </select>
            <input className="rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Thiết bị / máy cần mượn" />
            <input type="number" min="1" className="rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Số lượng" />
            <div className="grid gap-4 md:grid-cols-2">
              <input type="datetime-local" className="rounded-xl border border-slate-200 px-4 py-3 outline-none" />
              <input type="datetime-local" className="rounded-xl border border-slate-200 px-4 py-3 outline-none" />
            </div>
            <textarea className="min-h-[110px] rounded-xl border border-slate-200 px-4 py-3 outline-none" placeholder="Mục đích mượn..." />
            <button className="w-fit rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white">Gửi phiếu mượn</button>
          </div>
        </SectionCard>

        <SectionCard title="Danh sách phiếu mượn">
          <DataTable
            columns={[
              { key: "code", title: "Mã phiếu" },
              { key: "borrower", title: "Người mượn" },
              { key: "className", title: "Lớp" },
              { key: "item", title: "Thiết bị" },
              { key: "quantity", title: "SL" },
              { key: "expectedReturnAt", title: "Hạn trả" },
              { key: "status", title: "Trạng thái", isStatus: true },
            ]}
            data={loanRequests}
          />
        </SectionCard>
      </div>
    </AppShell>
  );
}
