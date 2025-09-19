import { useEffect, useState } from "react";
import { HorizontalCard } from "../components/Horizontal-Card";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchSearchQuery } from "../hooks/api";
import { Spinner } from "../components/Spinner";

function ResultsPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [AllResults, setAllresults] = useState([]);
  const location = useLocation();
  const navigateTo = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
  const [type, setType] = useState("All");

  useEffect(() => {
    switch (type) {
      case "All":
        setSearchResults(AllResults);
        break;
      case "Movies":
        setSearchResults(AllResults.filter((e) => e.media_type === "movie"));
        console.log();
        break;
      case "TvShows":
        setSearchResults(AllResults.filter((e) => e.media_type === "tv"));
        console.log(AllResults.filter((e) => e.media_type === "tv"));
        break;
    }
  }, [type]);

  useEffect(() => {
    loadUpcomingMovies(pageNo);
  }, [pageNo]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      fetchSearchQuery(pageNo, query).then((res) => {
        setAllresults(res);
        setSearchResults(res);
      });

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }, 2000);
  }, [location]);
  function morePage() {
    setPageNo((e) => e + 1);
  }

  function loadUpcomingMovies(pageNo) {
    setLoading(true);

    setTimeout(() => {
      fetchSearchQuery(pageNo, query).then((res) => {
        console.log(res[3]);
        setAllresults(res);
        setSearchResults((e) => [...e, ...res]);
        setLoading(false);
      });

      setTimeout(() => {}, 2000);
    }, 2000);
  }

  function navigateToAboutMovies({ id, genreId, mediaType }) {
    if (mediaType === "movie") {
      navigateTo(`/movie-info?movieid=${id}&genreid=${genreId}`);
    } else if (mediaType === "tv") {
      navigateTo(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
    }
  }

  return loading ? (
    <Spinner className={"text-5xl opacity-85"} />
  ) : searchResults.length === 0 ? (
    <div className="flex flex-col items-center">
      <i className="fa fa-file-fragment text-8xl mb-4"></i>
      <h2 className="text-3xl font-bold ">Not Found</h2>
      <p className="opacity-70 font-light">No search results for ${query}</p>
    </div>
  ) : (
    <main className="flex flex-col">
      <h2 className="my-4 text-lg">Search Results for "{query}"</h2>
      <TypeTab type={type} setType={setType}></TypeTab>
      <div className="grid md:grid-cols-2 gap-8">
        {" "}
        {searchResults.map((result, index) => {
          const mediatype = result.media_type;
          return (
            <HorizontalCard
              onClick={() => {
                navigateToAboutMovies({
                  id: result.id,
                  genreId: result.genre_ids[0],
                  mediaType: result.media_type,
                });
              }}
              key={index}
              date={
                mediatype == "movie"
                  ? result.release_date
                  : result.first_air_date
              }
              imgSrc={`https://image.tmdb.org/t/p/w500/${result.poster_path}`}
              title={mediatype == "movie" ? result.title : result.name}
              desc={result.overview}
              ratings={result.vote_average}
            ></HorizontalCard>
          );
        })}
      </div>
      {loading ? (
        <div className="spinner mx-auto"></div>
      ) : (
        <button
          className="px-8 py-4 bg-default mx-auto my-6 rounded-lg font-bold"
          onClick={morePage}
        >
          Load More
        </button>
      )}
    </main>
  );
}

function TypeTab({ type, setType }) {
  return (
    <div
      className={`flex gap-x-4 my-4 [&_h4]:px-6 [&_h4]:py-3 [&_h4]:rounded-lg `}
    >
      <h4
        className={`${type === "All" ? "bg-default" : "bg-neutral-900"}`}
        onClick={() => {
          setType("All");
        }}
      >
        All
      </h4>
      <h4
        className={`${type === "Movies" ? "bg-default" : "bg-neutral-900"}`}
        onClick={() => {
          setType("Movies");
        }}
      >
        Movie
      </h4>
      <h4
        className={`${type === "TvShows" ? "bg-default" : "bg-neutral-900"}`}
        onClick={() => {
          setType("TvShows");
        }}
      >
        TvShows
      </h4>
    </div>
  );
}
export default ResultsPage;
