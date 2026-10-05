export function SortBar({
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="relative shrink-0">
      <i
        className="
          fa fa-sort-amount-desc
          pointer-events-none
          absolute left-3.5 top-1/2
          z-10
          -translate-y-1/2
          text-[10px]
          text-white/30
        "
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort movies"
        className="
          h-10
          w-full
          appearance-none
          rounded-lg
          border border-white/[0.09]
          bg-white/[0.035]
          pl-9
          pr-9
          text-xs
          font-semibold
          text-white/65
          outline-none
          transition-all
          hover:border-white/[0.15]
          hover:bg-white/[0.055]
          focus:border-red-500/40
          focus:ring-2
          focus:ring-red-500/10
          sm:w-[165px]
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-neutral-900 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>

      <i
        className="
          fa fa-chevron-down
          pointer-events-none
          absolute right-3.5 top-1/2
          -translate-y-1/2
          text-[8px]
          text-white/25
        "
      />
    </div>
  );
}