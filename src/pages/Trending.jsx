import { useEffect, useState } from "react";

import { fetchNowPlayingMovies } from "../hooks/movies";
import { fetchOnAirTvs } from "../hooks/tvShows";

import { CategoriesUi } from "../components/CategriesUi";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function Trending() {
  const navigate = useNavigate();
  const location = useLocation();

  const [trendingMoviesList, setTrendingMoviesList] =
    useState([]);

  const [trendingTvsList, setTrendingTvsList] =
    useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(
      location.search
    );

    const reqType = queryParams.get("type");

    return reqType === "TvShows"
      ? "TvShows"
      : "Movies";
  });

  // Keep Movie / TV selection synced with the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(
      location.search
    );

    const reqType = queryParams.get("type");

    setType(
      reqType === "TvShows"
        ? "TvShows"
        : "Movies"
    );
  }, [location.search]);

  // Load movies only when Movies is active
  useEffect(() => {
    if (type !== "Movies") return;

    loadTrendingMovies();
  }, [moviesPageNo, type]);

  // Load TV shows only when TV Shows is active
  useEffect(() => {
    if (type !== "TvShows") return;

    loadTrendingTvs();
  }, [tvPageNo, type]);

  async function loadTrendingMovies() {
    try {
      setLoading(true);

      const res = await fetchNowPlayingMovies(
        moviesPageNo
      );

      setTrendingMoviesList((current) =>
        moviesPageNo === 1
          ? res || []
          : [...current, ...(res || [])]
      );
    } catch (error) {
      console.error(
        "Failed to load trending movies:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadTrendingTvs() {
    try {
      setLoading(true);

      const res = await fetchOnAirTvs(tvPageNo);

      setTrendingTvsList((current) =>
        tvPageNo === 1
          ? res || []
          : [...current, ...(res || [])]
      );
    } catch (error) {
      console.error(
        "Failed to load trending TV shows:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleTypeChange(nextType) {
    setType(nextType);

    setMoviesPageNo(1);
    setTvPageNo(1);

    setTrendingMoviesList([]);
    setTrendingTvsList([]);

    const queryParams = new URLSearchParams(
      location.search
    );

    queryParams.set("type", nextType);

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
      ? trendingMoviesList
      : trendingTvsList;

  return (
    <CategoriesUi
      itemsList={currentList}
      morePage={morePage}
      isloading={loading}
      listType={type}
      setListType={handleTypeChange}
      onItemsClick={navigateToAbout}
    />
  );
}

export default Trending;