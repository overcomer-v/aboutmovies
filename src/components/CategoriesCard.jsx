import { Link } from "react-router-dom";

export function GenreListCard({ label,genreId,onClick }) {
    return (
      <Link onClick={onClick} to={`/genre-page/${genreId}/${label}`} className="hover:bg-neutral-800 px-5 py-3 text-neutral-300 whitespace-nowrap text-xs border-2 rounded-3xl border-neutral-800">
        {label}
      </Link>
    );
  }