import { useEffect, useState } from "react";

import { fetchTopMovies } from "../hooks/movies";
import { fetchTopTvs } from "../hooks/tvShows";
import { CategoriesUi } from "../components/CategriesUi";

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

  // Keep Movie / TV selection synced with the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    setType(reqType === "TvShows" ? "TvShows" : "Movies");
  }, [location.search]);

  // Load movies
  useEffect(() => {
    loadTopMovies();
  }, [moviesPageNo]);

  // Load TV shows
  useEffect(() => {
    loadTopTvs();
  }, [tvPageNo]);

  async function loadTopMovies() {
    try {
      setLoading(true);

      const res = await fetchTopMovies(moviesPageNo);

      setTopMoviesList((current) => [
        ...current,
        ...(res || []),
      ]);
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

      setTopTvsList((current) => [
        ...current,
        ...(res || []),
      ]);
    } catch (error) {
      console.error("Failed to load top TV shows:", error);
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
      const genreId = item.genre_ids?.[0];

      navigate(
        `/movie-info?movieid=${id}&genreid=${genreId}`
      );
    } else {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(
        `/tvshow-info?tvid=${id}&tv-genreid=${genreId}`
      );
    }
  }

  const currentList =
    type === "Movies"
      ? topMoviesList
      : topTvsList;

  return (
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
  );
}

export default TopMoviesPage;