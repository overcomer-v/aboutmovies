import { useEffect, useState } from "react";
import { fetchNowPlayingMovies, fetchPopularMovies, fetchTopMovies } from "../hooks/loader";

function Home() {
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [topMoviesList, setTopMoviesList] = useState([]);
  const [trendingMoviesList, setTrendingMoviesList] = useState([]);


  const [loading,setLoading] = useState(true);

  const filePaths = [
    "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
    "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
    "/images/desktop-wallpaper-spiderman-amoled-balck.jpg",
  ];

  const filePathsT = [
    "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
    "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
    "/images/desktop-wallpaper-spiderman-amoled-balck.jpg",
    "/images/desktop-wallpaper-doctor-strange-in-the-multiverse-of-madness-movie-poster-2022.jpg",
    "/images/desktop-wallpaper-dune-2021-movie-poster-movie-posters-2021.jpg",
  ];

  useEffect(() => {
    loadTrendingMovies();
    loadTopMovies();
    loadPopularMovies();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [popularMoviesList]);


  function loadPopularMovies() {
    fetchPopularMovies().then((res) => setPopularMoviesList(res));
  }

  function loadTrendingMovies() {
    fetchNowPlayingMovies().then((res) => setTrendingMoviesList(res));
  }

  function loadTopMovies() {
    fetchTopMovies().then((res) => setTopMoviesList(res));
  }


  return (
    <main className="flex flex-col w-full ">
      { loading ? (<div>Loading...</div> ):( <div className="flex flex-col w-full ">


      <div className="grid grid-cols-1 gap-x-4">
      {popularMoviesList.slice(0,1).map((popularMovies,index)=>(
         <BigCard
        key={index}
         imgSrc={`https://image.tmdb.org/t/p/w1280/${popularMovies.backdrop_path}`}
         tile={popularMovies.title}
         desc={popularMovies.overview}
       ></BigCard>
       ))}
      </div>


      <section className="flex flex-col ">


        <Subtitle label={"What's Popular"}></Subtitle>
        <div className="flex gap-x-2 no-scrollbar overflow-x-auto">
          {popularMoviesList.slice(1, 10).map((popularMovies, index) => (
            <SmallCard
              key={index}
              imgSrc={`https://image.tmdb.org/t/p/w185/${popularMovies.poster_path}`}
              title={popularMovies.title}
              date={popularMovies.release_date}
              ratings={popularMovies.vote_average}
            ></SmallCard>
          ))}
        </div>


        <Subtitle label={"What's Trending"}></Subtitle>
        <div className="flex gap-x-3 no-scrollbar overflow-x-auto">
          {trendingMoviesList.slice(9, 20).map((trendingMovie, index) => (
            <MediumCard
              key={index}
              date={trendingMovie.release_date}
              imgSrc={`https://image.tmdb.org/t/p/w500/${trendingMovie.backdrop_path}`}
              title={trendingMovie.title}
              desc={trendingMovie.overview}
              ratings={trendingMovie.vote_average}
            ></MediumCard>
          ))}
        </div>

        <Subtitle label={"You Might Like"}></Subtitle>
        <div className="flex gap-x-2 no-scrollbar overflow-x-auto">
          {topMoviesList.slice(1, 10).map((topMovies, index) => (
            <SmallCard
              key={index}
              imgSrc={`https://image.tmdb.org/t/p/w185/${topMovies.poster_path}`}
              title={topMovies.title}
              date={topMovies.release_date}
              ratings={topMovies.vote_average}
            ></SmallCard>
          ))}
        </div>
      </section>
      <section></section>
      </div>)}
    </main>
  );
}

function BigCard({ imgSrc, tile, desc, rating }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden flex no-scrollbar ">
      <img
        className="w-full h-[450px] object-cover top-1/2 left-1/2"
        src={imgSrc}
        alt=""
      />
      <div className="bg-black w-full h-full absolute opacity-30"></div>
      <div className="absolute bottom-10 left-10">
        {" "}
        <div className="font-bold text-2xl mb-6">{tile}</div>
        <div className="truncate-multiline w-[70%] mb-4">{desc}</div>
        <div className="flex gap-4">
          <button className="bg-white rounded-3xl px-6 py-2 text-black flex items-center gap-2">
            <i className="fa fa-play"></i>
            <p>Trailer</p>
          </button>

          <button className="border-white border-4 rounded-3xl px-6 py-2 text-black flex items-center gap-2">
            <i className="fa fa-info text-white"></i>
            <p className="text-white">More Info</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function MediumCard({imgSrc, title, date, desc, ratings }) {
  return (
    <div
      className="w-1/3 flex flex-col flex-shrink-0 "
    >
      <img
        className="w-full object-cover rounded-2xl mb-3"
        src={imgSrc}
        alt=""
      />
      {/* <div className="bg-black w-full h-full absolute opacity-50"></div> */}
      <div className=" flex flex-col">
        {" "}
        <div className="flex justify-between mr-12 mb-2 mt-2">
        <h1 className="font-bold text-xl mb-1">{title}</h1>
        <p className="opacity-50">{date.slice(0,4)}</p>
        </div>
        <div className="truncate-multiline w-[90%] mb-3">{desc} </div>
        <div className="flex justify-between">
          <button className="bg-white w-fit rounded-3xl px-6 py-2 text-black flex items-center gap-2">
            <i className="fa fa-play"></i>
            <p>Trailer</p>
          </button>

          <div className="flex items-center gap-2 mr-12">
            <i className="fa fa-star"></i>
            <p>{ratings.toString().slice(0,3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallCard({ imgSrc, title, date, ratings }) {
  return (
    <div
     
      className="w-[16%] flex flex-col no-scrollbar flex-shrink-0"
    >
      <img
        className="w-full h-[250px] object-cover rounded-lg mb-3"
        src={imgSrc}
        alt=""
      />
      {/* <div className="bg-black w-full h-full absolute opacity-50"></div> */}
      <h2 className="font-bold mb-1">{title}</h2>
      <div className="grid grid-cols-2 [&_p]:opacity-70">
        <div className="flex items-center gap-2">
          <i className="fa fa-star"></i>
          <p>{ratings.toString().slice(0,3)}</p>
        </div>
        <p>{date.slice(0,4) }</p>
      </div>
    </div>
  );
}

function Subtitle({ label }) {
  return <h2 className="font-bold text-2xl my-6">{label}</h2>;
}

export default Home;
