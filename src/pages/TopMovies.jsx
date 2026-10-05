import { useEffect, useState } from "react";

import { fetchMovies } from "../hooks/movies";
import { fetchTopTvs } from "../hooks/tvShows";

import { CategoriesUi } from "../components/CategriesUi";
import { SortBar } from "../components/SortBar";

import {
  MOVIE_SORT_OPTIONS,
  TV_SORT_OPTIONS,
} from "../constants/sortOptions";

import { useLocation, useNavigate } from "react-router-dom";

function TopMoviesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [topMoviesList, setTopMoviesList] = useState([]);
  const [topTvsList, setTopTvsList] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType === "TvShows" ? "TvShows" : "Movies";
  });

  const [sortBy, setSortBy] = useState(() => {
    const queryParams = new URLSearchParams(location.search);

    // Top Movies should start with Top Rated.
    return queryParams.get("sort") || "vote_average.desc";
  });

  // Keep Movie / TV selection and sorting synced with the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const reqType = queryParams.get("type");
    const urlSort = queryParams.get("sort");

    setType(reqType === "TvShows" ? "TvShows" : "Movies");

    setSortBy(
      urlSort ||
        (reqType === "TvShows"
          ? "popularity.desc"
          : "vote_average.desc")
    );
  }, [location.search]);

  // Load movies
  useEffect(() => {
    if (type !== "Movies") return;

    loadTopMovies();
  }, [moviesPageNo, sortBy, type]);

  // Load TV shows
  useEffect(() => {
    if (type !== "TvShows") return;

    loadTopTvs();
  }, [tvPageNo, type]);

  async function loadTopMovies() {
    try {
      setLoading(true);

      const res = await fetchMovies({
        page: moviesPageNo,
        sortBy,
      });

      setTopMoviesList((current) =>
        moviesPageNo === 1
          ? res || []
          : [...current, ...(res || [])]
      );
    } catch (error) {
      console.error("Failed to load top movies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTopTvs() {
    try {
      setLoading(true);

      const res = await fetchTopTvs(tvPageNo);

      setTopTvsList((current) =>
        tvPageNo === 1
          ? res || []
          : [...current, ...(res || [])]
      );
    } catch (error) {
      console.error("Failed to load top TV shows:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSortChange(newSort) {
    setSortBy(newSort);

    setMoviesPageNo(1);
    setTvPageNo(1);

    setTopMoviesList([]);
    setTopTvsList([]);

    const queryParams = new URLSearchParams(location.search);

    queryParams.set("sort", newSort);

    navigate(
      `${location.pathname}?${queryParams.toString()}`,
      { replace: true }
    );
  }

  function handleTypeChange(nextType) {
    setType(nextType);

    setMoviesPageNo(1);
    setTvPageNo(1);

    setTopMoviesList([]);
    setTopTvsList([]);

    const queryParams = new URLSearchParams(location.search);

    queryParams.set("type", nextType);

    // Give each content type a sensible default.
    if (nextType === "Movies") {
      queryParams.set("sort", "vote_average.desc");
      setSortBy("vote_average.desc");
    } else {
      queryParams.set("sort", "popularity.desc");
      setSortBy("popularity.desc");
    }

    navigate(
      `${location.pathname}?${queryParams.toString()}`,
      { replace: true }
    );
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
      const genreId = item.genre_ids?.[0];

      navigate(
        `/movie-info?movieid=${id}&genreid=${genreId || ""}`
      );
    } else {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(
        `/tvshow-info?tvid=${id}&tv-genreid=${genreId || ""}`
      );
    }
  }

  const currentList =
    type === "Movies"
      ? topMoviesList
      : topTvsList;

  const currentSortOptions =
    type === "Movies"
      ? MOVIE_SORT_OPTIONS
      : TV_SORT_OPTIONS;

  return (
    <div className="w-full">
      <SortBar
        value={sortBy}
        onChange={handleSortChange}
        options={currentSortOptions}
      />

      <CategoriesUi
        itemsList={currentList}
        morePage={morePage}
        isloading={loading}
        listType={type}
        setListType={handleTypeChange}
        onItemsClick={navigateToAbout}
      />
    </div>
  );
}

export default TopMoviesPage;