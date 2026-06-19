export default function SectionCard({ title, rightAction, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/70 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        {rightAction}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
