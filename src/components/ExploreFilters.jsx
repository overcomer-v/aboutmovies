import { useEffect, useMemo, useState } from "react";

const RATING_OPTIONS = [
  { label: "Any rating", value: "" },
  { label: "6+", value: "6" },
  { label: "7+", value: "7" },
  { label: "8+", value: "8" },
  { label: "9+", value: "9" },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();

  return [
    { label: "Any year", value: "" },
    ...Array.from({ length: 30 }, (_, index) => {
      const year = currentYear - index;

      return {
        label: String(year),
        value: String(year),
      };
    }),
  ];
}

function FilterSelect({ icon, label, value, onChange, children }) {
  return (
    <div className="group">
      <label className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-white/50 transition-colors group-focus-within:bg-red-500/10 group-focus-within:text-red-400">
          <i className={`fa ${icon} text-[11px]`} />
        </span>
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="
            h-12 w-full appearance-none rounded-xl
            border border-white/[0.09]
            bg-white/[0.045]
            px-4 pr-11
            text-sm font-medium text-white
            outline-none
            transition-all duration-200
            hover:border-white/[0.16]
            hover:bg-white/[0.06]
            focus:border-red-500/50
            focus:bg-white/[0.06]
            focus:ring-4 focus:ring-red-500/[0.08]
          "
        >
          {children}
        </select>

        <i className="fa fa-chevron-down pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/30" />
      </div>
    </div>
  );
}

export function ExploreFilters({
  open,
  onClose,
  genres = [],
  filters,
  onApply,
  onReset,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const yearOptions = useMemo(() => getYearOptions(), []);

  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const updateFilter = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = {
      genreId: "",
      year: "",
      minRating: "",
    };

    setDraftFilters(emptyFilters);
    onReset();
    onClose();
  };

  const activeFilterCount = Object.values(draftFilters).filter(Boolean).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="
          fixed inset-0 z-40
          bg-black/70
          backdrop-blur-[3px]
          transition-opacity
        "
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
        className="
          fixed right-0 top-0 z-50
          flex h-dvh w-full max-w-md flex-col
          border-l border-white/[0.08]
          bg-[#0b0b0d]
          shadow-[-20px_0_60px_rgba(0,0,0,0.45)]
        "
      >
        {/* Header */}
        <div className="relative border-b border-white/[0.08] px-6 pb-5 pt-6">
          {/* Subtle accent */}
          <div className="absolute left-0 top-0 h-px w-24 bg-red-500" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <i className="fa fa-sliders text-xs" />
                </span>

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-400">
                  Discover
                </span>
              </div>

              <h2
                id="filters-title"
                className="text-xl font-bold tracking-tight text-white"
              >
                Filters
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Narrow down your movie results
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-white/[0.08]
                bg-white/[0.04]
                text-white/45
                transition-all
                hover:border-white/[0.14]
                hover:bg-white/[0.08]
                hover:text-white
                focus:outline-none
                focus:ring-4 focus:ring-white/[0.05]
              "
              aria-label="Close filters"
            >
              <i className="fa fa-times text-sm" />
            </button>
          </div>

          {/* Active filter indicator */}
          {activeFilterCount > 0 && (
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-white/45">
                {activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"} selected
              </span>
            </div>
          )}
        </div>

        {/* Filter content */}
        <div className="flex-1 overflow-y-auto px-6 py-7">
          <div className="space-y-7">
            <FilterSelect
              icon="fa-film"
              label="Genre"
              value={draftFilters.genreId}
              onChange={(event) =>
                updateFilter("genreId", event.target.value)
              }
            >
              <option value="" className="bg-[#111113]">
                All genres
              </option>

              {genres.map((genre) => (
                <option
                  key={genre.id}
                  value={genre.id}
                  className="bg-[#111113]"
                >
                  {genre.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              icon="fa-calendar"
              label="Release year"
              value={draftFilters.year}
              onChange={(event) =>
                updateFilter("year", event.target.value)
              }
            >
              {yearOptions.map((option) => (
                <option
                  key={option.value || "any"}
                  value={option.value}
                  className="bg-[#111113]"
                >
                  {option.label}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              icon="fa-star"
              label="Minimum rating"
              value={draftFilters.minRating}
              onChange={(event) =>
                updateFilter("minRating", event.target.value)
              }
            >
              {RATING_OPTIONS.map((option) => (
                <option
                  key={option.value || "any"}
                  value={option.value}
                  className="bg-[#111113]"
                >
                  {option.label}
                </option>
              ))}
            </FilterSelect>
          </div>

          {/* Helpful hint */}
          <div className="mt-9 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/35">
                <i className="fa fa-lightbulb-o text-xs" />
              </div>

              <div>
                <p className="text-xs font-semibold text-white/65">
                  Refine your discovery
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/30">
                  Combine filters to find movies that match your exact taste.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/[0.08] bg-[#0b0b0d]/95 px-6 pb-6 pt-4 backdrop-blur-xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="
                h-12 flex-1 rounded-xl
                border border-white/[0.09]
                bg-white/[0.035]
                text-sm font-semibold text-white/55
                transition-all
                hover:border-white/[0.15]
                hover:bg-white/[0.07]
                hover:text-white
                active:scale-[0.98]
              "
            >
              <i className="fa fa-refresh mr-2 text-[10px]" />
              Reset
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="
                h-12 flex-[1.5] rounded-xl
                bg-red-500
                text-sm font-bold text-white
                shadow-lg shadow-red-500/20
                transition-all
                hover:bg-red-400
                hover:shadow-xl hover:shadow-red-500/25
                active:scale-[0.98]
              "
            >
              Apply filters
              <i className="fa fa-arrow-right ml-2 text-[10px]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
