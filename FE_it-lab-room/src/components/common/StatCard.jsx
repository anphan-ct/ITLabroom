export default function StatCard({ title, value, desc, icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">{value}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{desc}</p>
        </div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-blue-700">{icon}</div>
      </div>
    </div>
  );
}
