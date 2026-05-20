import { useLocation } from "react-router-dom";
import AppShell from "../../common/AppShell";
import IncidentForm from "../../common/IncidentForm";
import SectionCard from "../../common/SectionCard";

export default function StudentIncidentPage() {
  const { state } = useLocation();

  return (
    <AppShell role="student" title="Báo hỏng máy tính" subtitle="Sinh viên cập nhật tình trạng máy hoặc thiết bị">
      <SectionCard title="Form báo hỏng">
        <IncidentForm
          initialComputerCode={state?.computerCode}
          initialRoomCode={state?.room}
        />
      </SectionCard>
    </AppShell>
  );
}
