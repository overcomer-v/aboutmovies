import { useEffect, useState } from "react";
import {
  fetchMovieGenres,
  fetchMoviesByGenres,
} from "../hooks/movies";
import { CategoriesUi } from "../components/CategriesUi";
import { fetchTvsByGenres } from "../hooks/tvShows";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GenreListCard } from "../components/CategoriesCard";

export function GenreOpener() {
  const navigate = useNavigate();
  const location = useLocation();
  const { genreId, genre } = useParams();

  const [genrelist, setGenreList] = useState([]);

  const [genremoviesList, setGenresMoviesList] = useState([]);
  const [genresTvList, setGenresTvlist] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType === "TvShows" ? "TvShows" : "Movies";
  });

  // Load genres once
  useEffect(() => {
    loadGenreList();
  }, []);

  // Keep type synced with URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    setType(reqType === "TvShows" ? "TvShows" : "Movies");
  }, [location.search]);

  // Load the selected type
  useEffect(() => {
    if (!genreId) return;

    if (type === "Movies") {
      loadGenreMoviesList();
    } else {
      loadGenreTvList();
    }
  }, [genreId, type, moviesPageNo, tvPageNo]);

  async function loadGenreList() {
    try {
      const res = await fetchMovieGenres();
      setGenreList(res || []);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  }

  async function loadGenreMoviesList() {
    try {
      setLoading(true);

      const res = await fetchMoviesByGenres(
        genreId,
        moviesPageNo
      );

      setGenresMoviesList((current) => [
        ...current,
        ...(res || []),
      ]);
    } catch (error) {
      console.error("Failed to load genre movies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadGenreTvList() {
    try {
      setLoading(true);

      const res = await fetchTvsByGenres(
        genreId,
        tvPageNo
      );

      setGenresTvlist((current) => [
        ...current,
        ...(res || []),
      ]);
    } catch (error) {
      console.error("Failed to load genre TV shows:", error);
    } finally {
      setLoading(false);
    }
  }

  function morePage() {
    if (type === "Movies") {
      setMoviesPageNo((current) => current + 1);
    } else {
      setTvPageNo((current) => current + 1);
    }
  }

  function navigateToAbout(item) {
    if (!item) return;

    if (type === "Movies") {
      const id = item.id;
      const movieGenreId = item.genre_ids?.[0] || genreId;

      navigate(
        `/movie-info?movieid=${id}&genreid=${movieGenreId}`
      );
    } else {
      const id = item.id;
      const tvGenreId = item.genre_ids?.[0] || genreId;

      navigate(
        `/tvshow-info?tvid=${id}&tv-genreid=${tvGenreId}`
      );
    }
  }

  function handleGenreChange(selectedGenreId) {
    if (String(selectedGenreId) === String(genreId)) {
      return;
    }

    // Clear old results
    setGenresMoviesList([]);
    setGenresTvlist([]);

    // Reset pagination
    setMoviesPageNo(1);
    setTvPageNo(1);
  }

  const currentList =
    type === "Movies"
      ? genremoviesList
      : genresTvList;

  return (
    <div className="w-full">
      <h1 className="mb-3 pl-3 font-nunito text-2xl font-bold lg:text-3xl">
        {genre}s
      </h1>

      <div className="mx-1 my-4 flex gap-2 overflow-x-auto no-scrollbar">
        {genrelist.map((genreItem) => (
          <GenreListCard
            key={genreItem.id}
            label={genreItem.name}
            genreId={genreItem.id}
            onClick={() =>
              handleGenreChange(genreItem.id)
            }
          />
        ))}
      </div>

      <CategoriesUi
        itemsList={currentList}
        morePage={morePage}
        isloading={loading}
        listType={type}
        setListType={setType}
        onItemsClick={(item) => {
          navigateToAbout(item);
        }}
      />
    </div>
  );
}
