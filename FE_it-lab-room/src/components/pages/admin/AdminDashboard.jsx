import { CalendarDays, Cpu, Monitor, Wrench } from "lucide-react";
import AppShell from "../../common/AppShell";
import StatCard from "../../common/StatCard";
import SectionCard from "../../common/SectionCard";
import CalendarTable from "../../common/CalendarTable";
import { dashboardStats, maintenanceTickets, schedules } from "../../../data/mockData";
import DataTable from "../../common/DataTable";

export default function AdminDashboard() {
  return (
    <AppShell role="admin" title="Dashboard Admin" subtitle="Tổng quan hệ thống phòng máy">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tổng phòng máy" value={dashboardStats.totalRooms} desc="Số phòng đang quản lý" icon={<Monitor size={22} />} />
        <StatCard title="Tổng máy tính" value={dashboardStats.totalComputers} desc="Thiết bị hiện có" icon={<Cpu size={22} />} />
        <StatCard title="Máy hỏng" value={dashboardStats.brokenComputers} desc="Cần xử lý bảo trì" icon={<Wrench size={22} />} />
        <StatCard title="Lịch hôm nay" value={dashboardStats.todaySchedules} desc="Ca sử dụng phòng" icon={<CalendarDays size={22} />} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="Lịch sử dụng phòng gần nhất">
            <CalendarTable data={schedules} />
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Phiếu bảo trì mới">
            <DataTable
              columns={[
                { key: "computer", title: "Máy" },
                { key: "issue", title: "Lỗi" },
                { key: "status", title: "Trạng thái", isStatus: true },
              ]}
              data={maintenanceTickets}
            />
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
