type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export default function PortfolioOverviewCard({
  label,
  value,
  helper,
}: Props) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 backdrop-blur p-5 hover:border-[#636EE1]/40 transition"
    >
      <div className="text-xs uppercase tracking-wide opacity-60">
        {label}
      </div>

      <div className="mt-2 text-2xl font-semibold">
        {value}
        {helper && (
          <div className="mt-1 ml-2 text-[11px] font-light opacity-50 inline">
            ( {helper} )
          </div>
        )}
      </div>

    </div>
  );
}
