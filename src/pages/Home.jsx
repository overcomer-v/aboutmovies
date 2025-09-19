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
import {
  fetchOnAirTvs,
  fetchPopularTvs,
  fetchTopTvs,
  fetchTvTrailers,
} from "../hooks/tvShows";
import { Spinner } from "../components/Spinner";

function Home() {
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [topMoviesList, setTopMoviesList] = useState([]);
  const [trendingMoviesList, setTrendingMoviesList] = useState([]);
  const [genrelist, setGenreList] = useState([]);
  const [onAirTshows, setOnAirTvShows] = useState([]);
  const [popularTshows, setpopularTvShows] = useState([]);
  const [topTvshows, setTopTvshows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    return isMobile;
  });
  const navigateTo = useNavigate();
  // const filePaths = [
  //   "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
  //   "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
  //   "/images/desktop-wallpaper-spiderman-amoled-balck.jpg",
  // ];

  // const filePathsT = [
  //   "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
  //   "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
  //   "/images/desktop-wallpaper-spiderman-amoled-balck.jpg",
  //   "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
  //   "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
  // ];

  useEffect(() => {
    loadTopTvs();
    loadPopularTvs();
    loadGenreList();
    loadTrendingMovies();
    loadTopMovies();
    loadOnAirTvs();
    loadPopularMovies();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [popularMoviesList]);

  function loadPopularMovies() {
    fetchPopularMovies().then((res) => setPopularMoviesList(res));
  }

  function loadGenreList() {
    fetchMovieGenres().then((res) => setGenreList(res));
  }

  function loadTrendingMovies() {
    fetchNowPlayingMovies().then((res) => setTrendingMoviesList(res));
  }

  function loadTopMovies() {
    fetchTopMovies().then((res) => setTopMoviesList(res));
  }

  function loadOnAirTvs() {
    fetchOnAirTvs().then((res) => setOnAirTvShows(res));
  }

  function loadPopularTvs() {
    fetchPopularTvs().then((res) => setpopularTvShows(res));
  }

  function loadTopTvs() {
    fetchTopTvs().then((res) => setTopTvshows(res));
  }

  function navigateToAbout({ moviesId, movieGenreId, tvId, tvGenreId }) {
    if (moviesId) {
      navigateTo(`/movie-info?movieid=${moviesId}&genreid=${movieGenreId}`);
    } else if (tvId) {
      navigateTo(`/tvshow-info?tvid=${tvId}&tv-genreid=${tvGenreId}`);
    }
  }

  return loading ? (
    <Spinner className={"text-5xl opacity-80"}></Spinner>
  ) : (
    <main className="flex flex-col w-full h-full bg">
  
        <div className="flex flex-col w-full pb-16 ">
          <div className="flex my-4 gap-2 no-scrollbar overflow-x-auto mx-1">
            {genrelist.map((genre) => (
              <GenreListCard key={genre.id} label={genre.name}></GenreListCard>
            ))}
          </div>

          <div className="grid w-full grid-cols-1 mb-6">
            {popularMoviesList.slice(0, 1).map((popularMovies, index) => (
              <BigCard
                key={index}
                imgSrc={`https://image.tmdb.org/t/p/w1280/${popularMovies.backdrop_path}`}
                tile={popularMovies.title}
                desc={popularMovies.overview}
                voteAverage={popularMovies.vote_average}
                releaseDate={popularMovies.release_date}
                onTrailerClick={() => {
                  fetchMovieTrailers(popularMovies.id).then((res) => {
                    window.open(
                      `https://www.youtube.com/watch?v=${res[0].key}`
                    );
                  });
                }}
                 onClick={() => {
                      navigateToAbout({
                        moviesId: popularMovies.id,
                        movieGenreId: popularMovies.genre_ids[0],
                      });
                    }}
              ></BigCard>
            ))}
          </div>

          <section className="flex flex-col px-2 lg:px-0">
            <Subtitle
              label={"What's Trending"}
              goToRoute={"/trendings"}
            ></Subtitle>
            <div className="flex gap-x-3 mb-8 no-scrollbar overflow-x-auto">
              {trendingMoviesList.slice(9, 20).map((trendingMovie, index) => (
                <MediumCard
                  key={index}
                  date={trendingMovie.release_date}
                  imgSrc={`https://image.tmdb.org/t/p/w500/${trendingMovie.backdrop_path}`}
                  title={trendingMovie.title}
                  desc={trendingMovie.overview}
                  ratings={trendingMovie.vote_average}
                  onClick={() => {
                    navigateToAbout({
                      moviesId: trendingMovie.id,
                      movieGenreId: trendingMovie.genre_ids[0],
                    });
                  }}
                ></MediumCard>
              ))}
            </div>

            <Subtitle label={"What's Popular"}></Subtitle>
            <div className="flex items-center flex-col gap-6 mb-16 ">
              <div className="grid md:grid-cols-4 justify-center items-center grid-cols-[45%_45%] gap-x-3 gap-y-10 w-full">
                {popularMoviesList
                  .slice(2, isMobile ? 6 : 10)
                  .map((popularMovies, index) => (
                    <SmallCard
                      key={index}
                      imgSrc={`https://image.tmdb.org/t/p/w500/${popularMovies.poster_path}`}
                      title={popularMovies.title}
                      date={popularMovies.release_date}
                      ratings={popularMovies.vote_average}
                      onClick={() => {
                        navigateToAbout({
                          moviesId: popularMovies.id,
                          movieGenreId: popularMovies.genre_ids[0],
                        });
                      }}
                    ></SmallCard>
                  ))}
              </div>
              <button
                className="bg-default w-fit rounded-3xl px-6 py-2  flex items-center gap-2"
                onClick={() => {
                  navigateTo("/popular-page");
                }}
              >
                <p className="text-sm lg:text-base">Show More</p>
              </button>
            </div>

            {/*  */}

            <Subtitle
              label={"On Air TvShows"}
              goToRoute={"/trendings?type=TvShows"}
            ></Subtitle>
            <div className="flex gap-x-2 no-scrollbar overflow-x-auto mb-12">
              {onAirTshows.slice(0, 10).map((tvShows, index) => (
                <MediumCard
                  key={index}
                  imgSrc={`https://image.tmdb.org/t/p/w500/${tvShows.backdrop_path}`}
                  title={tvShows.name}
                  date={tvShows.first_air_date}
                  ratings={tvShows.vote_average}
                  desc={tvShows.overview}
                  onClick={() => {
                    navigateToAbout({
                      tvId: tvShows.id,
                      tvGenreId: tvShows.genre_ids[0],
                    });
                  }}
                ></MediumCard>
              ))}
            </div>

            <Subtitle
              label={"Popular TvShows"}
              goToRoute={"/popular-page?type=TvShows"}
            ></Subtitle>
            <div className="flex gap-x-3 no-scrollbar overflow-x-auto mb-16">
              {popularTshows.slice(0, 10).map((tvShows, index) => (
                <div className="flex lg:w-[22%] w-[42%] flex-shrink-0">
                  <SmallCard
                    key={index}
                    imgSrc={`https://image.tmdb.org/t/p/w500/${tvShows.poster_path}`}
                    title={tvShows.name}
                    date={tvShows.first_air_date}
                    ratings={tvShows.vote_average}
                    isTvShows={true}
                    onClick={() => {
                      navigateToAbout({
                        tvId: tvShows.id,
                        tvGenreId: tvShows.genre_ids[0],
                      });
                    }}
                  ></SmallCard>
                </div>
              ))}
            </div>

            <Subtitle label={"Favourite TvShows"}></Subtitle>
            <div className="flex items-center flex-col gap-6 mb-6">
              <div className="grid md:grid-cols-4 items-center justify-center grid-cols-2 gap-4">
                {topTvshows.slice(0, isMobile ? 4 : 8).map((tvShows, index) => (
                  <SmallCard
                    key={index}
                    imgSrc={`https://image.tmdb.org/t/p/w500/${tvShows.poster_path}`}
                    title={tvShows.name}
                    date={tvShows.first_air_date}
                    ratings={tvShows.vote_average}
                    onClick={() => {
                      navigateToAbout({
                        tvId: tvShows.id,
                        tvGenreId: tvShows.genre_ids[0],
                      });
                    }}
                  ></SmallCard>
                ))}
              </div>

              <button className="bg-default w-fit rounded-3xl px-6 py-2  flex items-center gap-2">
                <p className="text-sm lg:text-base">Show More</p>
              </button>
            </div>

            <Subtitle
              label={"You Might Like"}
              goToRoute={"/topmovies-page?type=TvShows"}
            ></Subtitle>
            <div className="flex gap-x-2 mb-12 no-scrollbar overflow-x-auto">
              {topMoviesList.slice(0, 10).map((movies, index) => (
                <div className="lg:w-[22%] w-[42%] flex-shrink-0">
                  <SmallCard
                    key={index}
                    imgSrc={`https://image.tmdb.org/t/p/w500/${movies.poster_path}`}
                    title={movies.title}
                    date={movies.release_date}
                    ratings={movies.vote_average}
                    onClick={() => {
                      navigateToAbout({
                        moviesId: movies.id,
                        movieGenreId: movies.genre_ids[0],
                      });
                    }}
                  ></SmallCard>
                </div>
              ))}
            </div>
          </section>
          <section></section>
        </div>
    </main>
  );
}

function BigCard({ imgSrc, tile, desc, onTrailerClick, voteAverage, releaseDate,onClick }) {
  return (
    <div onClick={onClick} className="relative h-[300px] lg:h-[500px] cursor-pointer w-full lg:rounded-2xl overflow-hidden flex no-scrollbar ">
      <img
        className="w-full object-cover lg:top-1/2  lg:left-1/2"
        src={imgSrc}
        alt=""
      />
      <div className="bg-black w-full h-full absolute opacity-30"></div>
      <div className="absolute lg:bottom-10 lg:left-10 bottom-4 left-4">
        {" "}
          <div className="flex md:mb-1 items-center  h-8 text-center [&_p]:text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <i className="fa fa-star text-yellow-500"></i>
              <p className=" text-sm lg:text-base"> {voteAverage}</p>
            </div>
            <span className="mx-3 font-bold text-2xl  leading-none">·</span>
            <p>{releaseDate}</p>

            <p className="hidden md:block">
              <span className="mx-3 font-bold text-2xl">·</span>2h50m
            </p>
          </div>
        <div className="font-bold lg:text-4xl text-3xl lg:mb-6 mb-3 font-nunito">
          {tile}
        </div>
        <div className=" lg:truncate-multiline truncate-threeline lg:w-[70%] w-[95%] mb-4 text-xs opacity-80">
          {desc}
        </div>
        <div className="flex gap-4">
          <button
            onClick={onTrailerClick}
            className="bg-default text-white rounded-3xl  px-4 py-1 lg:px-6 lg:py-2  flex items-center gap-2"
          >
            <i className="fa fa-play"></i>
            <p className="text-sm">Trailer</p>
          </button>

          <button className="border-white border-2 rounded-3xl px-2 py-1 lg:px-4 lg:py-2 text-black flex items-center gap-2">
            <i className="fa fa-info text-white text-sm lg:text-base"></i>
            <p className="text-white text-sm hidden lg:inline">More Info</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function SmallCard({ imgSrc, title, date, ratings, isTvShows, onClick }) {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="flex w-full flex-col transition-transform duration-300 hover:scale-95 cursor-pointer no-scrollbar flex-shrink-0 "
    >
      <img
        className="w-full md:h-[400px] h-[200px] object-cover rounded-lg mb-3"
        src={imgSrc}
        alt=""
        loading="eager"
      />
      {/* <div className="bg-black w-full h-full absolute opacity-50"></div> */}
      <div className="flex flex-col justify-between">
        <h2
          className={`font-bold mb-1 ${
            !isTvShows ? "trunicate-oneline" : ""
          } font-nunito`}
        >
          {title}
        </h2>
        <div className="grid grid-cols-2 [&_p]:opacity-70">
          <div className="flex items-center gap-2">
            <i className="fa fa-star text-yellow-500"></i>
            <p className="text-sm font-light">
              {ratings.toString().slice(0, 3)}
            </p>
          </div>
          <p className="text-sm">{date.slice(0, 4)}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
