import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function DataTable({ columns, data, getRowLink }) {
  const navigate = useNavigate();

  const handleRowClick = (event, row) => {
    const rowLink = getRowLink?.(row);

    if (!rowLink || event.target.closest("a,button,input,select,textarea")) {
      return;
    }

    navigate(rowLink);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={(event) => handleRowClick(event, row)}
              className={`hover:bg-slate-50 ${getRowLink ? "cursor-pointer" : ""}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-700">
                  {col.render ? col.render(row[col.key], row) : col.isStatus ? <StatusBadge value={row[col.key]} /> : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
