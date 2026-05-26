import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
import AppShell from "../../common/AppShell";
import SectionCard from "../../common/SectionCard";
import DataTable from "../../common/DataTable";
import { deleteSubject, getSubjects } from "../../../data/subjectsStore";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(() => getSubjects());

  const handleDelete = (subject) => {
    const accepted = window.confirm(`Xóa môn học ${subject.name}?`);

    if (accepted) {
      setSubjects(deleteSubject(subject.id));
    }
  };

  return (
    <AppShell role="admin" title="Quản lý môn học" subtitle="Danh mục môn học trong khoa">
      <SectionCard
        rightAction={
          <Link
            to="/admin/subjects/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Thêm môn
          </Link>
        }
        title="Danh sách môn học"
      >
        <DataTable
          columns={[
            { key: "ordinal", title: "TT" },
            { key: "name", title: "Tên môn" },
            { key: "type", title: "Loại", render: (value) => value || "LT" },
            { key: "credits", title: "ĐVHP" },
            {
              key: "actions",
              title: "Thao tác",
              render: (_, subject) => (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/subjects/${subject.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                  >
                    <Edit size={15} />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(subject)}
                    className="inline-flex items-center gap-2 rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
                  >
                    <Trash2 size={15} />
                    Xóa
                  </button>
                </div>
              ),
            },
          ]}
          data={subjects.map((subject, index) => ({
            ...subject,
            ordinal: index + 1,
          }))}
        />
      </SectionCard>
    </AppShell>
  );
}
