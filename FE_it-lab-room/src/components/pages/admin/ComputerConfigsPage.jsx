import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react";
import AppShell from "../../common/AppShell";

const configData = [
  {
    id: 1,
    code: "CFG01",
    cpu: "Intel Core i5-10400",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Intel UHD Graphics",
    monitor: '22"',
    os: "Windows 10",
    status: "Đang dùng",
  },
  {
    id: 2,
    code: "CFG02",
    cpu: "Intel Core i7-10700",
    ram: "16GB DDR4",
    storage: "512GB SSD",
    gpu: "GTX 1650",
    monitor: '24"',
    os: "Windows 11",
    status: "Đang dùng",
  },
  {
    id: 3,
    code: "CFG03",
    cpu: "AMD Ryzen 5 5600G",
    ram: "8GB DDR4",
    storage: "256GB SSD",
    gpu: "Radeon Graphics",
    monitor: '22"',
    os: "Ubuntu 22.04",
    status: "Ngừng dùng",
  },
];

function StatusBadge({ status }) {
  const styles = {
    "Đang dùng": "bg-emerald-100 text-emerald-700",
    "Ngừng dùng": "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex min-w-[96px] justify-center rounded-full px-3 py-1 text-sm font-semibold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function ComputerConfigsPage() {
  const [search, setSearch] = useState("");

  const filteredConfigs = useMemo(() => {
    return configData.filter((item) => {
      const keyword = search.toLowerCase();
      return (
        item.code.toLowerCase().includes(keyword) ||
        item.cpu.toLowerCase().includes(keyword) ||
        item.ram.toLowerCase().includes(keyword) ||
        item.storage.toLowerCase().includes(keyword) ||
        item.os.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  const totalConfigs = configData.length;
  const activeConfigs = configData.filter(
    (item) => item.status === "Đang dùng"
  ).length;
  const inactiveConfigs = configData.filter(
    (item) => item.status === "Ngừng dùng"
  ).length;

  return (
    <AppShell
      role="admin"
      title="Quản lý cấu hình máy"
      subtitle="Theo dõi CPU, RAM, ổ cứng và hệ điều hành của từng cấu hình"
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Tổng cấu hình</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {totalConfigs}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Đang dùng</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {activeConfigs}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ngừng dùng</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-700">
              {inactiveConfigs}
            </h3>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Cpu size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">CPU phổ biến</p>
                <h3 className="text-base font-semibold text-slate-800">
                  Intel Core i5 / i7
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <MemoryStick size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">RAM phổ biến</p>
                <h3 className="text-base font-semibold text-slate-800">
                  8GB / 16GB DDR4
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <HardDrive size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Ổ cứng phổ biến</p>
                <h3 className="text-base font-semibold text-slate-800">
                  256GB / 512GB SSD
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-bold text-slate-800">
              Danh sách cấu hình máy
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative w-full sm:w-[360px]">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Tìm mã cấu hình, CPU, RAM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">
                <Plus size={18} />
                Thêm cấu hình
              </button>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-100 xl:block">
            <div className="grid grid-cols-9 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
              <div>Mã cấu hình</div>
              <div>CPU</div>
              <div>RAM</div>
              <div>Ổ cứng</div>
              <div>GPU</div>
              <div>Màn hình</div>
              <div>Hệ điều hành</div>
              <div>Trạng thái</div>
              <div className="text-center">Thao tác</div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredConfigs.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-9 items-center px-5 py-4 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <div className="font-semibold">{item.code}</div>
                  <div>{item.cpu}</div>
                  <div>{item.ram}</div>
                  <div>{item.storage}</div>
                  <div>{item.gpu}</div>
                  <div>{item.monitor}</div>
                  <div>{item.os}</div>
                  <div>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200">
                      <Eye size={16} />
                    </button>
                    <button className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200">
                      <Pencil size={16} />
                    </button>
                    <button className="rounded-lg bg-rose-100 p-2 text-rose-600 hover:bg-rose-200">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 xl:hidden">
            {filteredConfigs.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.code}</h3>
                    <p className="text-sm text-slate-500">{item.cpu}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <span className="font-medium text-slate-500">RAM:</span>{" "}
                    {item.ram}
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">Ổ cứng:</span>{" "}
                    {item.storage}
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">GPU:</span>{" "}
                    {item.gpu}
                  </div>
                  <div>
                    <span className="font-medium text-slate-500">
                      Màn hình:
                    </span>{" "}
                    {item.monitor}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium text-slate-500">
                      Hệ điều hành:
                    </span>{" "}
                    {item.os}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                    Xem
                  </button>
                  <button className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700">
                    Sửa
                  </button>
                  <button className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-600">
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredConfigs.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              Không tìm thấy cấu hình phù hợp.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
