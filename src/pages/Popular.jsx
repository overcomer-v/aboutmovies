import { useEffect, useState } from "react";
import { fetchPopularMovies } from "../hooks/movies";
import { CategoriesUi } from "../components/CategriesUi";
import { fetchPopularTvs } from "../hooks/tvShows";
import { useLocation, useNavigate } from "react-router-dom";

function PopularPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [popularTvsList, setPopularTvsList] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType === "TvShows"
      ? "TvShows"
      : "Movies";
  });


  /* =========================================================
     LOAD MOVIES
  ========================================================= */

  useEffect(() => {
    loadPopularMovies();
  }, [moviesPageNo]);


  async function loadPopularMovies() {
    try {
      setLoading(true);

      const res = await fetchPopularMovies(moviesPageNo);

      setPopularMoviesList((current) => [
        ...current,
        ...(res || []),
      ]);
    } catch (error) {
      console.error(
        "Failed to load popular movies:",
        error
      );
    } finally {
      setLoading(false);
    }
  }


  /* =========================================================
     LOAD TV SHOWS
  ========================================================= */

  useEffect(() => {
    loadPopularTvs();
  }, [tvPageNo]);


  async function loadPopularTvs() {
    try {
      setLoading(true);

      const res = await fetchPopularTvs(tvPageNo);

      setPopularTvsList((current) => [
        ...current,
        ...(res || []),
      ]);
    } catch (error) {
      console.error(
        "Failed to load popular TV shows:",
        error
      );
    } finally {
      setLoading(false);
    }
  }


  /* =========================================================
     LOAD MORE
  ========================================================= */

  function morePage() {
    if (type === "Movies") {
      setMoviesPageNo((current) => current + 1);
    } else {
      setTvPageNo((current) => current + 1);
    }
  }


  /* =========================================================
     CARD CLICK
  ========================================================= */

  function navigateToAbout(item) {
    if (!item) return;

    if (type === "Movies") {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(
        `/movie-info?movieid=${id}&genreid=${genreId}`
      );
    }

    if (type === "TvShows") {
      const id = item.id;
      const genreId = item.genre_ids?.[0];

      navigate(
        `/tvshow-info?tvid=${id}&tv-genreid=${genreId}`
      );
    }
  }


  /* =========================================================
     CURRENT LIST
  ========================================================= */

  const currentList =
    type === "Movies"
      ? popularMoviesList
      : popularTvsList;


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

export default PopularPage;
