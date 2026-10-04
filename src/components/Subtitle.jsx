import { useNavigate } from "react-router-dom";

export function Subtitle({ label, goToRoute }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-5 lg:mb-6">
      {/* Section title */}
      <div className="flex items-center gap-3">
        <div
          className="
            h-7
            w-1
            rounded-full
            bg-red-500
            shadow-[0_0_10px_rgba(239,68,68,0.35)]
          "
        />

        <h2
          className="
            font-nunito
            text-xl
            lg:text-2xl
            font-bold
            tracking-tight
            text-white
          "
        >
          {label}
        </h2>
      </div>

      {/* View all */}
      {goToRoute && (
        <button
          onClick={() => navigate(goToRoute)}
          className="
            group
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-3
            py-2
            text-xs
            font-semibold
            text-white/60
            transition-all
            duration-200
            hover:border-red-500/30
            hover:bg-red-500/10
            hover:text-white
          "
        >
          <span className="hidden sm:inline">
            View all
          </span>

          <i
            className="
              fa fa-angle-right
              text-sm
              transition-transform
              duration-200
              group-hover:translate-x-0.5
            "
          />
        </button>
      )}
    </div>
  );
}