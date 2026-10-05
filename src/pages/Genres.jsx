import { useEffect, useState } from "react";

import { fetchMovieGenres, fetchMoviesByGenres } from "../hooks/movies";

import { CategoriesUi } from "../components/CategriesUi";
import { fetchTvsByGenres } from "../hooks/tvShows";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { GenreListCard } from "../components/CategoriesCard";
import { SortBar } from "../components/SortBar";
import { MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS } from "../constants/sortOptions";

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

  // --------------------------------
  // Movie / TV type
  // --------------------------------

  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType === "TvShows" ? "TvShows" : "Movies";
  });

  // --------------------------------
  // Sorting
  // --------------------------------

  const [sortBy, setSortBy] = useState(() => {
    const queryParams = new URLSearchParams(location.search);

    return queryParams.get("sort") || "popularity.desc";
  });

  // --------------------------------
  // Load genres once
  // --------------------------------

  useEffect(() => {
    loadGenreList();
  }, []);

  // --------------------------------
  // Keep type synced with URL
  // --------------------------------

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const reqType = queryParams.get("type");

    setType(reqType === "TvShows" ? "TvShows" : "Movies");
  }, [location.search]);

  // --------------------------------
  // Keep sorting synced with URL
  // --------------------------------

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const urlSort = queryParams.get("sort");

    setSortBy(urlSort || "popularity.desc");
  }, [location.search]);

  // --------------------------------
  // Load selected type
  // --------------------------------

  useEffect(() => {
    if (!genreId) return;

    if (type === "Movies") {
      loadGenreMoviesList();
    } else {
      loadGenreTvList();
    }
  }, [genreId, type, moviesPageNo, tvPageNo, sortBy]);

  // --------------------------------
  // Load genre list
  // --------------------------------

  async function loadGenreList() {
    try {
      const res = await fetchMovieGenres();

      setGenreList(res || []);
    } catch (error) {
      console.error("Failed to load genres:", error);
    }
  }

  // --------------------------------
  // Load genre movies
  // --------------------------------

  async function loadGenreMoviesList() {
    try {
      setLoading(true);

      const res = await fetchMoviesByGenres(genreId, moviesPageNo, sortBy);

      setGenresMoviesList((current) =>
        moviesPageNo === 1 ? res || [] : [...current, ...(res || [])],
      );
    } catch (error) {
      console.error("Failed to load genre movies:", error);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Load genre TV shows
  // --------------------------------

  async function loadGenreTvList() {
    try {
      setLoading(true);

      const res = await fetchTvsByGenres(genreId, tvPageNo, sortBy);

      setGenresTvlist((current) =>
        tvPageNo === 1 ? res || [] : [...current, ...(res || [])],
      );
    } catch (error) {
      console.error("Failed to load genre TV shows:", error);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Change sorting
  // --------------------------------

  function handleSortChange(newSort) {
    setSortBy(newSort);

    setMoviesPageNo(1);
    setTvPageNo(1);

    setGenresMoviesList([]);
    setGenresTvlist([]);

    const queryParams = new URLSearchParams(location.search);

    queryParams.set("sort", newSort);

    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
  }

  // --------------------------------
  // Load more
  // --------------------------------

  function morePage() {
    if (type === "Movies") {
      setMoviesPageNo((current) => current + 1);
    } else {
      setTvPageNo((current) => current + 1);
    }
  }

  // --------------------------------
  // Navigate to detail page
  // --------------------------------

  function navigateToAbout(item) {
    if (!item) return;

    if (type === "Movies") {
      const id = item.id;

      const movieGenreId = item.genre_ids?.[0] || genreId;

      navigate(`/movie-info?movieid=${id}&genreid=${movieGenreId}`);
    } else {
      const id = item.id;

      const tvGenreId = item.genre_ids?.[0] || genreId;

      navigate(`/tvshow-info?tvid=${id}&tv-genreid=${tvGenreId}`);
    }
  }

  // --------------------------------
  // Change genre
  // --------------------------------

  function handleGenreChange(selectedGenreId) {
    if (String(selectedGenreId) === String(genreId)) {
      return;
    }

    setGenresMoviesList([]);
    setGenresTvlist([]);

    setMoviesPageNo(1);
    setTvPageNo(1);

    // Keep the current sort when changing genres
    const queryParams = new URLSearchParams(location.search);

    queryParams.set("sort", sortBy);

    const selectedGenre = genrelist.find(
      (item) => String(item.id) === String(selectedGenreId),
    );

    if (!selectedGenre) return;

    navigate(
      `/genre-page/${selectedGenreId}/${encodeURIComponent(
        selectedGenre.name,
      )}?${queryParams.toString()}`,
    );
  }

  // --------------------------------
  // Current list
  // --------------------------------

  const currentList = type === "Movies" ? genremoviesList : genresTvList;

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="w-full">
      <h1 className="mb-3 pl-3 font-nunito text-2xl font-bold lg:text-3xl">
        {genre}
      </h1>

      {/* Genre selector */}

      <div className="mx-1 my-4 flex gap-2 overflow-x-auto no-scrollbar">
        {genrelist.map((genreItem) => (
          <GenreListCard
            key={genreItem.id}
            label={genreItem.name}
            genreId={genreItem.id}
            onClick={(e) => {
              e.preventDefault();

              handleGenreChange(genreItem.id);
            }}
          />
        ))}
      </div>

      {/* Sorting */}

      {type === "Movies" && (
        <SortBar
          value={sortBy}
          onChange={handleSortChange}
          options={type === "Movies" ? MOVIE_SORT_OPTIONS : TV_SORT_OPTIONS}
        />
      )}

      {/* Movies / TV */}

      <CategoriesUi
        itemsList={currentList}
        morePage={morePage}
        isloading={loading}
        listType={type}
        setListType={setType}
        onItemsClick={navigateToAbout}
      />
    </div>
  );
}
