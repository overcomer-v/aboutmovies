import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  fetchMovieGenres,
  fetchMovies,
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchTopMovies,
  fetchUpcomingMovies,
  fetchTrendingMovies,
} from "../hooks/movies";

import {
  fetchTvGenres,
  fetchTvs,
  fetchPopularTvs,
  fetchOnAirTvs,
  fetchTopTvs,
  fetchTrendingTvs,
} from "../hooks/tvShows";

import { CategoriesUi } from "../components/CategriesUi";
import { SortBar } from "../components/SortBar";
import { ExploreFilters } from "../components/ExploreFilters";

import {
  MOVIE_EXPLORE_CATEGORIES,
  TV_EXPLORE_CATEGORIES,
  EXPLORE_TYPES,
} from "../constants/exploreOptions";

import { MOVIE_SORT_OPTIONS, TV_SORT_OPTIONS } from "../constants/sortOptions";

export function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "movie";
  const category = searchParams.get("category") || "popular";

  const genreId = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const minRating = searchParams.get("rating") || "";
  const sort = searchParams.get("sort") || "popularity.desc";

  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isMovie = type === "movie";

  const categories = isMovie ? MOVIE_EXPLORE_CATEGORIES : TV_EXPLORE_CATEGORIES;

  const sortOptions = isMovie ? MOVIE_SORT_OPTIONS : TV_SORT_OPTIONS;

  const hasFilters = Boolean(genreId || year || minRating);

  const selectedGenre = useMemo(() => {
    return genres.find((genre) => String(genre.id) === String(genreId));
  }, [genres, genreId]);

  const selectedCategoryLabel =
    categories.find((item) => item.value === category)?.label || "Popular";

  useEffect(() => {
    async function loadGenres() {
      try {
        const result = isMovie
          ? await fetchMovieGenres()
          : await fetchTvGenres();

        setGenres(result || []);
      } catch (error) {
        console.error("Failed to load genres:", error);
      }
    }

    loadGenres();
  }, [isMovie]);

  useEffect(() => {
    async function loadInitialItems() {
      setIsLoading(true);
      setItems([]);
      setPage(1);

      try {
        const result = await fetchExploreItems({
          type,
          category,
          page: 1,
          sort,
          genreId,
          year,
          minRating,
          hasFilters,
        });

        setItems(result || []);
      } catch (error) {
        console.error("Failed to load explore items:", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialItems();
  }, [type, category, sort, genreId, year, minRating, hasFilters]);

  const updateUrl = (updates = {}) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    setSearchParams(nextParams);
  };

  const handleTypeChange = (nextType) => {
    updateUrl({
      type: nextType,
      category: "popular",
      genre: "",
      year: "",
      rating: "",
      sort: "popularity.desc",
    });
  };

  const handleCategoryChange = (nextCategory) => {
    updateUrl({
      category: nextCategory,
      genre: "",
      year: "",
      rating: "",
      sort: "popularity.desc",
    });
  };

  const handleSortChange = (nextSort) => {
    updateUrl({
      sort: nextSort,
    });
  };

  const handleApplyFilters = (nextFilters) => {
    updateUrl({
      category: nextFilters.genreId ? "genre" : category,
      genre: nextFilters.genreId,
      year: nextFilters.year,
      rating: nextFilters.minRating,
      sort,
    });
  };

  const handleResetFilters = () => {
    updateUrl({
      category: category === "genre" ? "popular" : category,
      genre: "",
      year: "",
      rating: "",
      sort: "popularity.desc",
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;

    setIsLoadingMore(true);

    try {
      const result = await fetchExploreItems({
        type,
        category,
        page: nextPage,
        sort,
        genreId,
        year,
        minRating,
        hasFilters,
      });

      setItems((current) => [...current, ...(result || [])]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more explore items:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleItemClick = (item) => {
    if (isMovie) {
      navigate(`/movie-info?movieid=${item.id}&genreid=${genreId || ""}`);
    } else {
      navigate(`/tvshow-info?tvid=${item.id}&tv-genreid=${genreId || ""}`);
    }
  };

  const filterValues = {
    genreId,
    year,
    minRating,
  };

  return (
    <main className="flex w-full flex-col pb-10">
      {/* Heading */}
      <section className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
          Discover
        </p>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Find something worth watching.
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-white/40">
          Browse movies and TV shows by popularity, ratings, genres, release
          dates, and more.
        </p>
      </section>
      {/* Type tabs */}
      <div className="mb-5 flex w-fit items-center gap-1 rounded-full border border-white/10 bg-neutral-900/80 p-1">
        {EXPLORE_TYPES.map((item) => {
          const active = item.value === type;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleTypeChange(item.value)}
              className={`
                rounded-full
                px-5
                py-2
                text-sm
                font-semibold
                transition-all
                duration-200
                ${
                  active
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/10"
                    : "text-white/40 hover:text-white"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {/* Categories */}
      <div className="mb-6 flex gap-2 flex-wrap pb-1 ">
        {categories.map((item) => {
          const active = item.value === category;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleCategoryChange(item.value)}
              className={`
                shrink-0
                rounded-full
                border
                px-4
                py-2
                text-xs
                font-semibold
                transition-all
                duration-200
                ${
                  active
                    ? "border-red-500/30 bg-red-500 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {/* Controls */}

{/* Explore toolbar */}
<div className="mb-7">


  {/* Controls */}
  <div
    className="
      flex flex-col gap-2
      sm:flex-row sm:items-center sm:justify-between
    "
  >
    {/* Left side */}
    <div className="flex min-w-0 items-center gap-2">
      {/* Filter */}
      <button
        type="button"
        onClick={() => setIsFilterOpen(true)}
        className="
          group
          flex h-10 shrink-0 items-center gap-2
          rounded-lg
          border border-white/[0.09]
          bg-white/[0.035]
          px-3.5
          text-sm font-medium text-white/70
          transition-all
          hover:border-red-500/30
          hover:bg-red-500/[0.06]
          hover:text-white
          active:scale-[0.98]
        "
      >
        <i
          className="
            fa fa-sliders
            text-[11px]
            text-white/40
            transition-colors
            group-hover:text-red-400
          "
        />

        <span>Filters</span>

        {hasFilters && (
          <span
            className="
              flex h-[18px] min-w-[18px]
              items-center justify-center
              rounded-md
              bg-red-500
              px-1
              text-[9px]
              font-bold
              text-white
            "
          >
            {[
              genreId,
              year,
              minRating,
            ].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Active filters */}
      {hasFilters && (
        <>
          <div className="h-5 w-px bg-white/[0.08]" />

          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
            {selectedGenre && (
              <span
                className="
                  max-w-[130px]
                  truncate
                  rounded-md
                  bg-white/[0.035]
                  px-2.5 py-1.5
                  text-[11px]
                  font-medium
                  text-white/35
                "
              >
                {selectedGenre.name}
              </span>
            )}

            {year && (
              <span
                className="
                  rounded-md
                  bg-white/[0.035]
                  px-2.5 py-1.5
                  text-[11px]
                  font-medium
                  text-white/35
                "
              >
                {year}
              </span>
            )}

            {minRating && (
              <span
                className="
                  rounded-md
                  bg-white/[0.035]
                  px-2.5 py-1.5
                  text-[11px]
                  font-medium
                  text-white/35
                "
              >
                {minRating}+
              </span>
            )}
          </div>
        </>
      )}
    </div>

    {/* Sort */}
   <div className="max-w-36">
     <SortBar
      value={sort}
      onChange={handleSortChange}
      options={sortOptions}
    />
   </div>
  </div>
</div>

      {/* Current selection */}
      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-white">
          {category === "genre" && selectedGenre
            ? selectedGenre.name
            : selectedCategoryLabel}
        </h2>
      </div>

      {/* Results */}
      <CategoriesUi
        itemsList={items}
        isloading={isLoading}
        morePage={items.length > 0 ? handleLoadMore : undefined}
        listType={isMovie ? "Movies" : "TvShows"}
        onItemsClick={handleItemClick}
      />
      {isLoadingMore && (
        <p className="mt-4 text-center text-xs text-white/30">
          Loading more...
        </p>
      )}
      {/* Filter drawer */}
      <ExploreFilters
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        genres={genres}
        filters={filterValues}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </main>
  );
}

async function fetchExploreItems({
  type,
  category,
  page,
  sort,
  genreId,
  year,
  minRating,
  hasFilters,
}) {
  const isMovie = type === "movie";

  /*
   * Once any filters are active, use TMDB's discover endpoint.
   * This gives us proper genre/year/rating filtering.
   */
  if (hasFilters) {
    const fetcher = isMovie ? fetchMovies : fetchTvs;

    return fetcher({
      page,
      sortBy: sort,
      genreId,
      year,
      minRating,
    });
  }

  if (category === "popular") {
    return isMovie ? fetchPopularMovies(page) : fetchPopularTvs(page);
  }

  if (category === "top-rated") {
    return isMovie ? fetchTopMovies(page) : fetchTopTvs(page);
  }

  if (category === "trending") {
    return isMovie ? fetchTrendingMovies(page) : fetchTrendingTvs(page);
  }

  if (category === "now-playing" && isMovie) {
    return fetchNowPlayingMovies(page);
  }

  if (category === "upcoming" && isMovie) {
    return fetchUpcomingMovies(page);
  }

  if (category === "on-air" && !isMovie) {
    return fetchOnAirTvs(page);
  }

  /*
   * Genre without any additional filters.
   * Use the generic discover endpoint so sorting still works.
   */
  if (category === "genre" && genreId) {
    const fetcher = isMovie ? fetchMovies : fetchTvs;

    return fetcher({
      page,
      sortBy: sort,
      genreId,
    });
  }

  return isMovie ? fetchPopularMovies(page) : fetchPopularTvs(page);
}
