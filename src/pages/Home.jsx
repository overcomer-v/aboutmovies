import { useEffect, useState } from "react";
import {
  fetchMovieGenres,
  fetchMovieTrailers,
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopMovies,
} from "../hooks/movies";
import { GenreListCard } from "../components/CategoriesCard";
import { useNavigate } from "react-router-dom";
import { Subtitle } from "../components/Subtitle";
import { MediumCard } from "../components/Medium-H-Card";
import { fetchOnAirTvs, fetchPopularTvs, fetchTopTvs } from "../hooks/tvShows";
import { Spinner } from "../components/Spinner";

function Home() {
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [topMoviesList, setTopMoviesList] = useState([]);
  const [trendingMoviesList, setTrendingMoviesList] = useState([]);
  const [genrelist, setGenreList] = useState([]);
  const [onAirTshows, setOnAirTvShows] = useState([]);
  const [popularTshows, setPopularTvShows] = useState([]);
  const [topTvshows, setTopTvshows] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [
          popularMovies,
          genres,
          trendingMovies,
          topMovies,
          onAirTvs,
          popularTvs,
          topTvs,
        ] = await Promise.all([
          fetchPopularMovies(),
          fetchMovieGenres(),
          fetchNowPlayingMovies(),
          fetchTopMovies(),
          fetchOnAirTvs(),
          fetchPopularTvs(),
          fetchTopTvs(),
        ]);

        setPopularMoviesList(popularMovies || []);
        setGenreList(genres || []);
        setTrendingMoviesList(trendingMovies || []);
        setTopMoviesList(topMovies || []);
        setOnAirTvShows(onAirTvs || []);
        setPopularTvShows(popularTvs || []);
        setTopTvshows(topTvs || []);
      } catch (error) {
        console.error("Failed to load homepage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  function navigateToAbout({ moviesId, movieGenreId, tvId, tvGenreId }) {
    if (moviesId != null) {
      navigateTo(`/movie-info?movieid=${moviesId}&genreid=${movieGenreId}`);
    } else if (tvId != null) {
      navigateTo(`/tvshow-info?tvid=${tvId}&tv-genreid=${tvGenreId}`);
    }
  }

  async function handleTrailer(movieId, e) {
    e?.stopPropagation();

    try {
      const trailers = await fetchMovieTrailers(movieId);

      const trailer =
        trailers?.find(
          (video) => video.site === "YouTube" && video.type === "Trailer",
        ) || trailers?.[0];

      if (trailer?.key) {
        window.open(
          `https://www.youtube.com/watch?v=${trailer.key}`,
          "_blank",
          "noopener,noreferrer",
        );
      }
    } catch (error) {
      console.error("Failed to load trailer:", error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner className="text-5xl opacity-80" />
      </div>
    );
  }

  const featuredMovie = popularMoviesList?.[0];

  return (
    <main className="w-full min-h-full bg-neutral-950 text-white">
      <div className="w-full pb-20">
        {/* GENRES */}
        <section className="pt-2 lg:pt-4 mb-">
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-2">
            {genrelist.map((genre) => (
              <div key={genre.id} className="flex-shrink-0  justify-center items-center py-3 pb-6">
                <GenreListCard label={genre.name} genreId={genre.id} />
              </div>
            ))}
          </div>
        </section>

        {/* HERO */}
        {featuredMovie && (
          <section className="mb-12">
            <BigCard
              imgSrc={`https://image.tmdb.org/t/p/w1280/${featuredMovie.backdrop_path}`}
              title={featuredMovie.title}
              desc={featuredMovie.overview}
              voteAverage={featuredMovie.vote_average}
              releaseDate={featuredMovie.release_date}
              onTrailerClick={(e) => handleTrailer(featuredMovie.id, e)}
              onClick={() =>
                navigateToAbout({
                  moviesId: featuredMovie.id,
                  movieGenreId: featuredMovie.genre_ids?.[0],
                })
              }
            />
          </section>
        )}

        <div className="flex flex-col gap-12 lg:gap-16">
          {/* TRENDING */}
          <section>
            <Subtitle label="What's Trending" goToRoute="/trendings" />

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {trendingMoviesList.slice(0, 10).map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-[70%] md:w-[30%] lg:w-[23%]"
                >
                  <MediumCard
                    date={movie.release_date}
                    imgSrc={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                    title={movie.title}
                    desc={movie.overview}
                    ratings={movie.vote_average}
                    onClick={() =>
                      navigateToAbout({
                        moviesId: movie.id,
                        movieGenreId: movie.genre_ids?.[0],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* POPULAR MOVIES */}
          <section>
            <Subtitle label="What's Popular" goToRoute="/popular-page" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 lg:gap-x-5 gap-y-10">
              {popularMoviesList.slice(1, 9).map((movie) => (
                <SmallCard
                  key={movie.id}
                  imgSrc={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  title={movie.title}
                  date={movie.release_date}
                  ratings={movie.vote_average}
                  onClick={() =>
                    navigateToAbout({
                      moviesId: movie.id,
                      movieGenreId: movie.genre_ids?.[0],
                    })
                  }
                />
              ))}
            </div>

            <ShowMoreButton onClick={() => navigateTo("/popular-page")} />
          </section>

          {/* ON AIR TV */}
          <section>
            <Subtitle
              label="On Air TV Shows"
              goToRoute="/trendings?type=TvShows"
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {onAirTshows.slice(0, 10).map((show) => (
                <div
                  key={show.id}
                  className="flex-shrink-0 w-[72%] sm:w-[42%] md:w-[30%] lg:w-[23%]"
                >
                  <MediumCard
                    imgSrc={`https://image.tmdb.org/t/p/w500/${show.backdrop_path}`}
                    title={show.name}
                    date={show.first_air_date}
                    ratings={show.vote_average}
                    desc={show.overview}
                    onClick={() =>
                      navigateToAbout({
                        tvId: show.id,
                        tvGenreId: show.genre_ids?.[0],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* POPULAR TV */}
          <section>
            <Subtitle
              label="Popular TV Shows"
              goToRoute="/popular-page?type=TvShows"
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {popularTshows.slice(0, 10).map((show) => (
                <div
                  key={show.id}
                  className="flex-shrink-0 w-[42%] sm:w-[30%] lg:w-[22%]"
                >
                  <SmallCard
                    imgSrc={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                    title={show.name}
                    date={show.first_air_date}
                    ratings={show.vote_average}
                    isTvShows
                    onClick={() =>
                      navigateToAbout({
                        tvId: show.id,
                        tvGenreId: show.genre_ids?.[0],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* TOP TV */}
          <section>
            <Subtitle
              label="Favourite TV Shows"
              goToRoute="/topmovies-page?type=TvShows"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
              {topTvshows.slice(0, 8).map((show) => (
                <SmallCard
                  key={show.id}
                  imgSrc={`https://image.tmdb.org/t/p/w500/${show.poster_path}`}
                  title={show.name}
                  date={show.first_air_date}
                  ratings={show.vote_average}
                  onClick={() =>
                    navigateToAbout({
                      tvId: show.id,
                      tvGenreId: show.genre_ids?.[0],
                    })
                  }
                />
              ))}
            </div>

            <ShowMoreButton
              onClick={() => navigateTo("/topmovies-page?type=TvShows")}
            />
          </section>

          {/* RECOMMENDATIONS */}
          <section>
            <Subtitle label="You Might Like" goToRoute="/topmovies-page" />

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {topMoviesList.slice(0, 10).map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-[42%] sm:w-[30%] lg:w-[22%]"
                >
                  <SmallCard
                    imgSrc={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    title={movie.title}
                    date={movie.release_date}
                    ratings={movie.vote_average}
                    onClick={() =>
                      navigateToAbout({
                        moviesId: movie.id,
                        movieGenreId: movie.genre_ids?.[0],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   HERO
========================================================= */

function BigCard({
  imgSrc,
  title,
  desc,
  onTrailerClick,
  voteAverage,
  releaseDate,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        group relative
        w-full
        h-[420px]
        sm:h-[450px]
        lg:h-[540px]
        overflow-hidden
        rounded-2xl
        cursor-pointer
        bg-neutral-900
      "
    >
      <img
        src={imgSrc}
        alt={title}
        className="
          absolute inset-0
          w-full h-full
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.03]
        "
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Content */}
      <div
        className="
        absolute
        left-5
        right-5
        bottom-6
        lg:left-10
        lg:right-auto
        lg:bottom-10
        lg:max-w-2xl
      "
      >
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm">
          <span className="flex items-center gap-1.5">
            <i className="fa fa-star text-yellow-500" />
            <span className="font-semibold">
              {Number(voteAverage || 0).toFixed(1)}
            </span>
          </span>

          <span className="text-white/30">•</span>

          <span className="text-white/70">{releaseDate?.slice(0, 4)}</span>

          <span className="hidden sm:inline text-white/30">•</span>

          <span className="hidden sm:inline text-white/70">Movie</span>
        </div>

        <h1
          className="
          font-nunito
          font-bold
          text-3xl
          sm:text-4xl
          lg:text-5xl
          leading-tight
          mb-3
        "
        >
          {title}
        </h1>

        <p
          className="
          text-xs
          sm:text-sm
          leading-relaxed
          text-white/70
          max-w-xl
          line-clamp-3
          mb-5
        "
        >
          {desc}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onTrailerClick}
            className="
              flex items-center gap-2
              rounded-full
              bg-red-500
              px-5 py-2.5
              text-sm font-semibold
              text-white
              shadow-lg shadow-red-500/20
              transition-all
              duration-200
              hover:bg-red-600
              hover:scale-105
              active:scale-95
            "
          >
            <i className="fa fa-play text-xs" />
            Trailer
          </button>

          <button
            onClick={(e) => e.stopPropagation()}
            className="
              flex items-center gap-2
              rounded-full
              border border-white/30
              bg-white/5
              backdrop-blur-md
              px-5 py-2.5
              text-sm font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-white
              hover:text-black
            "
          >
            <i className="fa fa-info text-xs" />
            <span className="hidden sm:inline">More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MOVIE CARD
========================================================= */

function SmallCard({ imgSrc, title, date, ratings, isTvShows, onClick }) {
  return (
    <article
      onClick={onClick}
      className="
        group
        min-w-0
        cursor-pointer
        transition-transform
        duration-300
        hover:-translate-y-1
      "
    >
      <div
        className="
        relative
        overflow-hidden
        rounded-xl
        bg-neutral-900
        aspect-[2/3]
        mb-3
      "
      >
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* Bottom gradient */}
        <div
          className="
          absolute
          inset-x-0
          bottom-0
          h-24
          bg-gradient-to-t
          from-black/80
          to-transparent
          opacity-80
        "
        />

        {/* Rating */}
        <div
          className="
          absolute
          top-2
          right-2
          flex
          items-center
          gap-1
          rounded-full
          bg-black/70
          backdrop-blur-md
          px-2
          py-1
          text-xs
          font-semibold
        "
        >
          <i className="fa fa-star text-yellow-500" />
          {Number(ratings || 0).toFixed(1)}
        </div>

        {/* Hover indicator */}
       
      </div>

      <h3
        className="
        font-nunito
        font-bold
        text-sm
        sm:text-base
        leading-snug
        truncate
        group-hover:text-red-400
        transition-colors
      "
      >
        {title}
      </h3>

      <div
        className="
        flex
        items-center
        justify-between
        mt-1
        text-xs
        text-white/50
      "
      >
        <span>{isTvShows ? "TV Show" : "Movie"}</span>

        <span>{date?.slice(0, 4)}</span>
      </div>
    </article>
  );
}

/* =========================================================
   SHOW MORE
========================================================= */

function ShowMoreButton({ onClick }) {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        className="
          group
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.04]
          px-6
          py-2.5
          text-sm
          font-semibold
          text-white/80
          transition-all
          duration-200
          hover:border-red-500/40
          hover:bg-red-500/10
          hover:text-white
        "
      >
        Show More
        <i
          className="
          fa fa-arrow-right
          text-xs
          transition-transform
          duration-200
          group-hover:translate-x-1
        "
        />
      </button>
    </div>
  );
}

export default Home;
