import { useEffect, useState } from "react";

import { fetchMovies } from "../hooks/movies";

import { CategoriesUi } from "../components/CategriesUi";
import { SortBar } from "../components/SortBar";

import { MOVIE_SORT_OPTIONS } from "../constants/sortOptions";

import { useLocation, useNavigate } from "react-router-dom";

function UpcomingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState(() => {
    const queryParams = new URLSearchParams(location.search);

    return (
      queryParams.get("sort") ||
      "primary_release_date.asc"
    );
  });

  // Keep sorting synced with the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    setSortBy(
      queryParams.get("sort") ||
        "primary_release_date.asc"
    );
  }, [location.search]);

  // Load upcoming movies
  useEffect(() => {
    loadUpcomingMovies();
  }, [pageNo, sortBy]);

  async function loadUpcomingMovies() {
    try {
      setLoading(true);

      const res = await fetchMovies({
        page: pageNo,
        sortBy,
      });

      setUpcomingMoviesList((current) =>
        pageNo === 1
          ? res || []
          : [...current, ...(res || [])]
      );
    } catch (error) {
      console.error(
        "Failed to load upcoming movies:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function handleSortChange(newSort) {
    setSortBy(newSort);

    setPageNo(1);

    setUpcomingMoviesList([]);

    const queryParams = new URLSearchParams(
      location.search
    );

    queryParams.set("sort", newSort);

    navigate(
      `${location.pathname}?${queryParams.toString()}`,
      { replace: true }
    );
  }

  function morePage() {
    setPageNo((current) => current + 1);
  }

  function navigateToAbout(item) {
    if (!item) return;

    const id = item.id;
    const genreId = item.genre_ids?.[0];

    navigate(
      `/movie-info?movieid=${id}&genreid=${genreId || ""}`
    );
  }

  return (
    <div className="w-full">
      <SortBar
        value={sortBy}
        onChange={handleSortChange}
        options={MOVIE_SORT_OPTIONS}
      />

      <CategoriesUi
        itemsList={upcomingMoviesList}
        listType="Movies"
        morePage={morePage}
        isloading={loading}
        onItemsClick={navigateToAbout}
      />
    </div>
  );
}

export default UpcomingPage;