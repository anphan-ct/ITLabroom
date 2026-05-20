import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import CalendarTable from "../../common/CalendarTable";
import { schedules } from "../../../data/mockData";

export default function TeacherSchedulePage() {
  return (
    <AppShell role="teacher" title="Lịch giảng dạy" subtitle="Xem lịch học và lịch phòng máy">
      <SectionCard title="Danh sách lịch dạy">
        <CalendarTable data={schedules} />
      </SectionCard>
    </AppShell>
  );
}
