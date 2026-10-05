import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchMovies } from "../hooks/movies";
import { fetchPopularTvs } from "../hooks/tvShows";

import { CategoriesUi } from "../components/CategriesUi";
import { SortBar } from "../components/SortBar";

import { MOVIE_SORT_OPTIONS } from "../constants/sortOptions";

function PopularPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [popularTvsList, setPopularTvsList] = useState([]);

  const [moviesPageNo, setMoviesPageNo] = useState(1);
  const [tvPageNo, setTvPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState(() => {
    const params = new URLSearchParams(location.search);
    const reqType = params.get("type");

    return reqType === "TvShows" ? "TvShows" : "Movies";
  });

  const [sortBy, setSortBy] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("sort") || "popularity.desc";
  }); // --------------------------------
  // Load Movies
  // --------------------------------

  useEffect(() => {
    if (type !== "Movies") return;

    loadPopularMovies();
  }, [moviesPageNo, sortBy, type]);

  async function loadPopularMovies() {
    try {
      setLoading(true);

      const results = await fetchMovies({
        page: moviesPageNo,
        sortBy,
      });

      setPopularMoviesList((current) =>
        moviesPageNo === 1 ? results : [...current, ...results],
      );
    } catch (error) {
      console.error("Failed to load popular movies:", error);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Load TV
  // --------------------------------

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSort = params.get("sort");

    setSortBy(urlSort || "popularity.desc");
  }, [location.search]);

  useEffect(() => {
    if (type !== "TvShows") return;

    loadPopularTvs();
  }, [tvPageNo, type]);

  async function loadPopularTvs() {
    try {
      setLoading(true);

      const results = await fetchPopularTvs(tvPageNo);

      setPopularTvsList((current) =>
        tvPageNo === 1 ? results : [...current, ...results],
      );
    } catch (error) {
      console.error("Failed to load popular TV shows:", error);
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------
  // Change Sorting
  // --------------------------------

  function handleSortChange(newSort) {
    setSortBy(newSort);

    setMoviesPageNo(1);
    setPopularMoviesList([]);

    const params = new URLSearchParams(location.search);

    params.set("sort", newSort);

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  }

  // --------------------------------
  // Load More
  // --------------------------------

  function morePage() {
    if (type === "Movies") {
      setMoviesPageNo((current) => current + 1);
    } else {
      setTvPageNo((current) => current + 1);
    }
  }

  // --------------------------------
  // Navigate to Detail Page
  // --------------------------------

  function navigateToAbout(item) {
    if (!item) return;

    if (type === "Movies") {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(`/movie-info?movieid=${id}&genreid=${genreId || ""}`);
    }

    if (type === "TvShows") {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(`/tvshow-info?tvid=${id}&tv-genreid=${genreId || ""}`);
    }
  }

  // --------------------------------
  // Current List
  // --------------------------------

  const currentList = type === "Movies" ? popularMoviesList : popularTvsList;

  return (
    <main className="w-full">
      {type === "Movies" && (
        <SortBar
          value={sortBy}
          onChange={handleSortChange}
          options={MOVIE_SORT_OPTIONS}
        />
      )}

      <CategoriesUi
        itemsList={currentList}
        morePage={morePage}
        isloading={loading}
        listType={type}
        setListType={setType}
        onItemsClick={navigateToAbout}
      />
    </main>
  );
}

export default PopularPage;
