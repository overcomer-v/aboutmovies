import { Link } from "react-router-dom";

export function GenreListCard({ label, genreId, onClick }) {
  return (
    <Link
      onClick={onClick}
      to={`/genre-page/${genreId}/${encodeURIComponent(label)}`}
      className="
        group
        inline-flex
        items-center
        gap-2
        whitespace-nowrap
        rounded-full
        border border-white/10
        bg-white/[0.03]
        px-4 py-2.5
        text-xs
        font-semibold
        text-white/55
        backdrop-blur-sm
        transition-all
        duration-200
        hover:border-red-500/30
        hover:bg-red-500/10
        hover:text-white
        active:scale-95
      "
    >
      <span
        className="
          h-1.5 w-1.5
          rounded-full
          bg-white/20
          transition-colors
          duration-200
          group-hover:bg-red-500
        "
      />

      {label}
    </Link>
  );
}
