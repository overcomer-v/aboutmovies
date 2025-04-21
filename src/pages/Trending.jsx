import { useEffect, useState } from "react";
import { fetchNowPlayingMovies } from "../hooks/loader";

function Trending() {
  const [trendingMoviesList, setTrendingMoviesList] = useState([]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  function loadTrendingMovies() {
    fetchNowPlayingMovies().then((res) => setTrendingMoviesList(res));
  }

  return (
    <main>
      <div className="flex flex-col gap-8">
        {" "}
        {trendingMoviesList.map((trendingMovie, index) => (
          <HorizontalCard
            key={index}
            date={trendingMovie.release_date}
            imgSrc={`https://image.tmdb.org/t/p/w500/${trendingMovie.poster_path}`}
            title={trendingMovie.title}
            desc={trendingMovie.overview}
            ratings={trendingMovie.vote_average}
          ></HorizontalCard>
        ))}
      </div>
    </main>
  );
}

function HorizontalCard({ imgSrc, title, date, ratings, desc }) {
  return (
    <div className="flex h-36 gap-6 items-center">
      <img className="w-fit h-full rounded-lg" src={imgSrc} alt="" />
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="w-[90%] mb-3 text-sm opacity-70">{desc}</p>
        <div className="flex gap-12">
          <p>{date}</p>
          <div className="flex items-center gap-2 mr-12">
            <i className="fa fa-star"></i>
            <p>{ratings.toString().slice(0,3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trending;
