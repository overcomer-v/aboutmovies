import { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { fetchSearchQuery } from "../hooks/api";

import { HorizontalCard } from "../components/Horizontal-Card";
import { Spinner } from "../components/Spinner";
import { SortBar } from "../components/SortBar";

import { SEARCH_SORT_OPTIONS } from "../constants/sortOptions";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);

  const query = queryParams.get("query") || "";

  const [allResults, setAllResults] = useState([]);

  const [pageNo, setPageNo] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [type, setType] = useState(() => {
    const reqType = queryParams.get("type");

    return ["Movies", "TvShows"].includes(reqType)
      ? reqType
      : "All";
  });

  const [sortBy, setSortBy] = useState(() => {
    return queryParams.get("sort") || "relevance";
  });

  /*
   * Keep filters synced with the URL.
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const reqType = params.get("type");
    const urlSort = params.get("sort");

    setType(
      reqType === "Movies" || reqType === "TvShows"
        ? reqType
        : "All"
    );

    setSortBy(urlSort || "relevance");
  }, [location.search]);

  /*
   * Fetch search results.
   *
   * Search data is fetched only when the query changes.
   */
  useEffect(() => {
    if (!query.trim()) {
      setAllResults([]);
      setPageNo(1);
      setLoading(false);
      return;
    }

    async function loadResults() {
      try {
        setLoading(true);

        const res = await fetchSearchQuery(1, query);

        setAllResults(res || []);
        setPageNo(1);
      } catch (error) {
        console.error("Failed to search:", error);

        setAllResults([]);
        setPageNo(1);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [query]);

  /*
   * Filter + sort the accumulated search results.
   */
  const searchResults = useMemo(() => {
    let results = [...allResults];

    // Filter by media type
    if (type === "Movies") {
      results = results.filter(
        (item) => item.media_type === "movie"
      );
    }

    if (type === "TvShows") {
      results = results.filter(
        (item) => item.media_type === "tv"
      );
    }

    // Relevance means keep TMDB's original ordering.
    if (sortBy === "relevance") {
      return results;
    }

    if (sortBy === "popularity.desc") {
      return results.sort(
        (a, b) =>
          (b.popularity || 0) -
          (a.popularity || 0)
      );
    }

    if (sortBy === "vote_average.desc") {
      return results.sort(
        (a, b) =>
          (b.vote_average || 0) -
          (a.vote_average || 0)
      );
    }

    if (
      sortBy === "date.desc" ||
      sortBy === "date.asc"
    ) {
      return results.sort((a, b) => {
        const dateA =
          a.media_type === "movie"
            ? a.release_date
            : a.first_air_date;

        const dateB =
          b.media_type === "movie"
            ? b.release_date
            : b.first_air_date;

        if (!dateA) return 1;
        if (!dateB) return -1;

        return sortBy === "date.desc"
          ? dateB.localeCompare(dateA)
          : dateA.localeCompare(dateB);
      });
    }

    if (
      sortBy === "title.asc" ||
      sortBy === "title.desc"
    ) {
      return results.sort((a, b) => {
        const titleA = (
          a.media_type === "movie"
            ? a.title
            : a.name
        ) || "";

        const titleB = (
          b.media_type === "movie"
            ? b.title
            : b.name
        ) || "";

        return sortBy === "title.asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      });
    }

    return results;
  }, [allResults, type, sortBy]);

  /*
   * Change Movie / TV filter.
   */
  function handleTypeChange(nextType) {
    setType(nextType);

    const params = new URLSearchParams(
      location.search
    );

    if (nextType === "All") {
      params.delete("type");
    } else {
      params.set("type", nextType);
    }

    navigate(
      `${location.pathname}?${params.toString()}`,
      { replace: true }
    );
  }

  /*
   * Change sorting.
   */
  function handleSortChange(newSort) {
    setSortBy(newSort);

    const params = new URLSearchParams(
      location.search
    );

    if (newSort === "relevance") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    navigate(
      `${location.pathname}?${params.toString()}`,
      { replace: true }
    );
  }

  /*
   * Load the next search page.
   */
  async function morePage() {
    if (loadingMore || !query.trim()) return;

    try {
      setLoadingMore(true);

      const nextPage = pageNo + 1;

      const res = await fetchSearchQuery(
        nextPage,
        query
      );

      const newResults = res || [];

      setAllResults((current) => [
        ...current,
        ...newResults,
      ]);

      setPageNo(nextPage);
    } catch (error) {
      console.error(
        "Failed to load more search results:",
        error
      );
    } finally {
      setLoadingMore(false);
    }
  }

  /*
   * Navigate to the correct detail page.
   */
  function navigateToAbout(item) {
    if (!item) return;

    const id = item.id;
    const genreId = item.genre_ids?.[0];

    if (item.media_type === "movie") {
      navigate(
        `/movie-info?movieid=${id}&genreid=${genreId || ""}`
      );
    }

    if (item.media_type === "tv") {
      navigate(
        `/tvshow-info?tvid=${id}&tv-genreid=${genreId || ""}`
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="text-5xl opacity-85" />
      </div>
    );
  }

  return (
    <main className="flex w-full flex-col pt-8">
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-nunito text-2xl font-bold lg:text-3xl">
          Search Results
        </h1>

        <p className="mt-1 text-sm text-white/40">
          Results for{" "}
          <span className="text-white/70">
            "{query}"
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-5">
        <TypeTab
          type={type}
          setType={handleTypeChange}
        />

        <SortBar
          value={sortBy}
          onChange={handleSortChange}
          options={SEARCH_SORT_OPTIONS}
        />
      </div>

      {/* Empty state */}
      {searchResults.length === 0 ? (
        <div className="flex min-h-[45vh] flex-col items-center justify-center text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.04]">
            <i className="fa fa-search text-3xl text-white/20" />
          </div>

          <h2 className="text-2xl font-bold">
            No results found
          </h2>

          <p className="mt-2 text-sm text-white/40">
            No{" "}
            {type === "All"
              ? ""
              : type.toLowerCase()}{" "}
            results for "{query}"
          </p>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="mb-4 mt-2 flex items-center justify-between">
            <p className="text-sm text-white/40">
              {searchResults.length} result
              {searchResults.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {searchResults.map((result) => {
              const mediaType = result.media_type;

              /*
               * TMDB can return people from multi-search.
               * We don't currently have a person detail page,
               * so skip them.
               */
              if (
                mediaType !== "movie" &&
                mediaType !== "tv"
              ) {
                return null;
              }

              return (
                <HorizontalCard
                  key={`${mediaType}-${result.id}`}
                  onClick={() =>
                    navigateToAbout(result)
                  }
                  date={
                    mediaType === "movie"
                      ? result.release_date
                      : result.first_air_date
                  }
                  imgSrc={
                    result.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                      : undefined
                  }
                  title={
                    mediaType === "movie"
                      ? result.title
                      : result.name
                  }
                  desc={result.overview}
                  ratings={result.vote_average}
                />
              );
            })}
          </div>

          {/* Load more */}
          <button
            onClick={morePage}
            disabled={loadingMore}
            className="
              group mx-auto my-8 flex items-center gap-2
              rounded-full border border-white/10
              bg-white/[0.04] px-7 py-3
              text-sm font-semibold text-white/70
              transition-all duration-200
              hover:border-red-500/40
              hover:bg-red-500
              hover:text-white
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {loadingMore ? (
              <>
                <i className="fa fa-spinner fa-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More
                <i className="fa fa-angle-down transition-transform duration-200 group-hover:translate-y-0.5" />
              </>
            )}
          </button>
        </>
      )}
    </main>
  );
}

function TypeTab({ type, setType }) {
  return (
    <div className="mb-1 inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-neutral-900/80 p-1 backdrop-blur-md">
      <button
        onClick={() => setType("All")}
        className={`
          rounded-full px-5 py-2 text-sm font-semibold
          transition-all duration-200
          ${
            type === "All"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-white/50 hover:text-white"
          }
        `}
      >
        All
      </button>

      <button
        onClick={() => setType("Movies")}
        className={`
          rounded-full px-5 py-2 text-sm font-semibold
          transition-all duration-200
          ${
            type === "Movies"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-white/50 hover:text-white"
          }
        `}
      >
        Movies
      </button>

      <button
        onClick={() => setType("TvShows")}
        className={`
          rounded-full px-5 py-2 text-sm font-semibold
          transition-all duration-200
          ${
            type === "TvShows"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-white/50 hover:text-white"
          }
        `}
      >
        TV Shows
      </button>
    </div>
  );
}

export default ResultsPage;