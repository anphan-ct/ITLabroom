import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Cpu, Pencil } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import { computers } from "../../../data/mockData";
import { getComputerConfig } from "../../../data/computerConfigs";

export default function ComputerConfigDetailPage() {
  const { computerCode } = useParams();
  const computer = computers.find((item) => item.code === computerCode);

  if (!computer) {
    return <Navigate to="/admin/computers" replace />;
  }

  const config = getComputerConfig(computer);

  return (
    <AppShell
      role="admin"
      title={`Cấu hình máy ${computer.code}`}
      subtitle={`${computer.name} - ${computer.room}`}
    >
      <SectionCard
        title="Thông tin cấu hình"
        rightAction={
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/admin/computers/${computer.code}/config/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Pencil size={16} />
              Cập nhật cấu hình
            </Link>
            <Link
              to="/admin/computers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Quay lại
            </Link>
          </div>
        }
      >
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Mã máy</p>
            <p className="mt-2 font-bold text-slate-900">{computer.code}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Phòng</p>
            <p className="mt-2 font-bold text-slate-900">{computer.room}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Trạng thái máy</p>
            <p className="mt-2 font-bold text-slate-900">{computer.status}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Mã cấu hình</p>
            <p className="mt-2 flex items-center gap-2 font-bold text-slate-900">
              <Cpu size={17} />
              {config.code}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">CPU</p>
            <p className="mt-2 font-bold text-slate-900">{config.cpu}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">RAM</p>
            <p className="mt-2 font-bold text-slate-900">{config.ram}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Ổ cứng</p>
            <p className="mt-2 font-bold text-slate-900">{config.storage}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">GPU</p>
            <p className="mt-2 font-bold text-slate-900">{config.gpu}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Màn hình</p>
            <p className="mt-2 font-bold text-slate-900">{config.monitor}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Hệ điều hành</p>
            <p className="mt-2 font-bold text-slate-900">{config.os}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Trạng thái cấu hình</p>
            <p className="mt-2 font-bold text-slate-900">{config.status}</p>
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}
