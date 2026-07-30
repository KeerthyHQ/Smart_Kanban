const StatsCard = ({ label, value, tone }) => (
  <article className={`rounded-xl border p-3 shadow-sm ${tone}`}>
    <p className="text-xs font-medium text-slate-600">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-slate-800">{value}</p>
  </article>
);

export default StatsCard;
