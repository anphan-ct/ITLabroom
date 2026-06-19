import { useMemo, useState } from "react";
import { CheckCircle, Search, Wrench } from "lucide-react";
import AppShell from "../../common/AppShell";
import DataTable from "../../common/DataTable";
import SectionCard from "../../common/SectionCard";
import { initialReturnReceipts } from "./adminPageData";

function normalizeReturnReceipt(receipt) {
  return {
    ...receipt,
    teacher: receipt.teacher || "Giảng viên IT Lab",
    status: receipt.status || "Chờ xác nhận",
  };
}

export default function ReturnApprovalPage() {
  const [receipts, setReceipts] = useState(() => initialReturnReceipts.map(normalizeReturnReceipt));
  const [searchKeyword, setSearchKeyword] = useState("");

  const updateStatus = (receiptId, status) => {
    setReceipts((currentReceipts) => {
      return currentReceipts.map((receipt) => {
        return receipt.id === receiptId ? { ...receipt, status } : receipt;
      });
    });
  };

  const filteredReceipts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return receipts.filter((receipt) => {
      const searchContent = [
        receipt.code,
        receipt.loanCode,
        receipt.teacher,
        receipt.returnedAt,
        receipt.quantity,
        receipt.note,
        receipt.status,
      ].join(" ").toLowerCase();

      return !keyword || searchContent.includes(keyword);
    });
  }, [receipts, searchKeyword]);

  return (
    <AppShell role="admin" title="Xác nhận phiếu trả máy" subtitle="Kiểm tra và tiếp nhận máy giảng viên trả lại">
      <SectionCard
        title="Danh sách phiếu trả chờ xác nhận"
        rightAction={
          <div className="relative">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="Tìm phiếu trả"
              className="w-full min-w-[240px] rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100 sm:w-72"
            />
          </div>
        }
      >
        <DataTable
          columns={[
            { key: "code", title: "Mã phiếu" },
            { key: "loanCode", title: "Phiếu mượn" },
            { key: "teacher", title: "Giảng viên" },
            { key: "returnedAt", title: "Ngày trả" },
            { key: "quantity", title: "Số lượng" },
            { key: "note", title: "Ghi chú" },
            { key: "status", title: "Trạng thái", isStatus: true },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, receipt) => (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(receipt.id, "Đã xác nhận")}
                    disabled={receipt.status === "Đã xác nhận"}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <CheckCircle size={14} />
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(receipt.id, "Cần kiểm tra")}
                    disabled={receipt.status === "Cần kiểm tra"}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <Wrench size={14} />
                    Cần kiểm tra
                  </button>
                </div>
              ),
            },
          ]}
          data={filteredReceipts}
          emptyText="Chưa có phiếu trả cần xác nhận"
        />
      </SectionCard>
    </AppShell>
  );
}
