import { ReactNode } from "react";

export default function MetricCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <div
      className="
        relative
        rounded-xl
        border border-white/10
        p-5
        overflow-hidden
      "
    >
      {/* Subtle gradient glow */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-br
          from-[#636EE1]/10
          via-transparent
          to-transparent
        "
      />

      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div>
          <div className="text-xs uppercase tracking-wide opacity-60">
            {label}
          </div>

          <div className="mt-2 text-4xl font-medium leading-none">
            {value}
          </div>

          {hint && (
            <div className="mt-2 text-xs opacity-50">
              {hint}
            </div>
          )}
        </div>

        {/* Right icon */}
        {icon && (
          <div
            className="
              h-10 w-10
              rounded-lg
              flex items-center justify-center
              bg-[#636EE1]/20
              text-[#636EE1]
            "
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
