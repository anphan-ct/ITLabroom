import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { computers } from "../../../data/mockData";
import { getComputerConfig } from "../../../data/computerConfigs";

export default function ComputerConfigEditPage() {
  const { computerCode } = useParams();
  const computer = computers.find((item) => item.code === computerCode);

  if (!computer) {
    return <Navigate to="/admin/computers" replace />;
  }

  const config = getComputerConfig(computer);

  return (
    <AppShell
      role="admin"
      title={`Cập nhật cấu hình ${computer.code}`}
      subtitle={`${computer.name} - ${computer.room}`}
    >
      <SectionCard
        title="Thông tin cấu hình máy"
        rightAction={
          <Link
            to={`/admin/computers/${computer.code}/config`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Quay lại
          </Link>
        }
      >
        <form className="grid gap-5 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Mã cấu hình</span>
            <input
              type="text"
              defaultValue={config.code}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">CPU</span>
            <input
              type="text"
              defaultValue={config.cpu}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">RAM</span>
            <input
              type="text"
              defaultValue={config.ram}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Ổ cứng</span>
            <input
              type="text"
              defaultValue={config.storage}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">GPU</span>
            <input
              type="text"
              defaultValue={config.gpu}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Màn hình</span>
            <input
              type="text"
              defaultValue={config.monitor}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Hệ điều hành</span>
            <input
              type="text"
              defaultValue={config.os}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Trạng thái cấu hình</span>
            <select
              defaultValue={config.status}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option>Đang dùng</option>
              <option>Ngừng dùng</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 lg:col-span-2">
            <Link
              to={`/admin/computers/${computer.code}/config`}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Save size={16} />
              Lưu cấu hình
            </button>
          </div>
        </form>
      </SectionCard>
    </AppShell>
  );
}
