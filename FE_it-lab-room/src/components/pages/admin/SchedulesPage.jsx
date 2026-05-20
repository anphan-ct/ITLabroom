import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteSchedules, getSchedules } from "../../../data/schedulesStore";
import { shifts } from "../../../data/mockData";

function getScheduleGroupKey(schedule) {
  return [
    schedule.day,
    schedule.room,
    schedule.subject,
    schedule.className,
    schedule.teacher,
    schedule.weekNumber,
    schedule.lessonStart,
    schedule.lessonEnd,
  ].join("|");
}

function getGroupedSchedules(schedules) {
  const shiftOrder = new Map(shifts.map((shift, index) => [shift.name, index]));
  const groups = new Map();

  schedules.forEach((schedule) => {
    const key = getScheduleGroupKey(schedule);
    const currentGroup = groups.get(key) || {
      ...schedule,
      ids: [],
      shiftItems: [],
    };

    currentGroup.ids.push(schedule.id);
    currentGroup.shiftItems.push({
      name: schedule.shift || "Theo ca",
      time: schedule.time,
      order: shiftOrder.get(schedule.shift) ?? 999,
    });
    groups.set(key, currentGroup);
  });

  return Array.from(groups.values()).map((group) => {
    const sortedShiftItems = [...group.shiftItems].sort((firstShift, secondShift) => firstShift.order - secondShift.order);
    const times = sortedShiftItems.map((shift) => shift.time).filter(Boolean);
    const firstTime = times[0]?.split(" - ")[0] || "";
    const lastTime = times[times.length - 1]?.split(" - ")[1] || "";

    return {
      ...group,
      id: group.ids.join("-"),
      firstScheduleId: group.ids[0],
      shift: sortedShiftItems.map((shift) => shift.name).join(", "),
      time: firstTime && lastTime ? `${firstTime} - ${lastTime}` : group.time,
    };
  });
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(() => getSchedules());
  const groupedSchedules = useMemo(() => getGroupedSchedules(schedules), [schedules]);

  const handleDelete = (schedule) => {
    const accepted = window.confirm(`Xóa lịch ${schedule.subject} - ${schedule.className}?`);

    if (accepted) {
      setSchedules(deleteSchedules(schedule.ids));
    }
  };

  return (
    <AppShell role="admin" title="Quản lý lịch phòng máy" subtitle="Lịch học, lịch sử dụng phòng máy">
      <SectionCard
        title="Thời khóa biểu phòng máy"
        rightAction={
          <Link
            to="/admin/schedules/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Thêm lịch
          </Link>
        }
      >
        <DataTable
          columns={[
            { key: "day", title: "Thứ" },
            {
              key: "shift",
              title: "Ca học",
              render: (value, schedule) => `${value} (${schedule.time})`,
            },
            { key: "room", title: "Phòng" },
            { key: "subject", title: "Môn học" },
            { key: "className", title: "Lớp" },
            { key: "teacher", title: "Giảng viên" },
            { key: "weekNumber", title: "Tuần" },
            {
              key: "lessonStart",
              title: "Tiết",
              render: (_, schedule) => `Tiết ${schedule.lessonStart} - ${schedule.lessonEnd}`,
            },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, schedule) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/schedules/${schedule.firstScheduleId}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1 text-amber-700 transition hover:bg-amber-200"
                  >
                    <Edit size={14} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(schedule)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-100 px-3 py-1 text-rose-700 transition hover:bg-rose-200"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              ),
            },
          ]}
          data={groupedSchedules}
        />
      </SectionCard>
    </AppShell>
  );
}
