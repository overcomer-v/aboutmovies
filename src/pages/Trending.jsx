import { useEffect, useState } from "react";
import { fetchNowPlayingMovies } from "../hooks/movies";
import { HorizontalCard } from "../components/Horizontal-Card";
import { fetchOnAirTvs } from "../hooks/tvShows";
import { CategoriesUi } from "../components/CategriesUi";
import { useLocation, useNavigate } from "react-router-dom";

function Trending() {
  const navigator = useNavigate();

  const [trendingMoviesList, setTrendingMoviesList] = useState([]);
  const [trendingTvsList, setTrendingTvsList] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);

  const [loading, setLoading] = useState(true);
  
 const location = useLocation();
  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");
    return reqType ? reqType : "Movies";
  });

  useEffect(() => {
   loadTrendingMovies();
  }, [moviesPageNo],[]);



  useEffect(() => {
    loadTrendingTvs();
  }, [tvPageNo]);

  function morePage() {
    type === "Movies"
      ? setMoviesPageNo((e) => e + 1)
      : setTvPageNo((e) => e + 1);
  }

  function loadTrendingMovies() {
    setLoading(true);
    fetchNowPlayingMovies(moviesPageNo).then((res) => {
      setLoading(false);
      setTrendingMoviesList((e) => [...e, ...res]);
      
    });
  }

function loadTrendingTvs() {
    setLoading(true);
    fetchOnAirTvs(moviesPageNo).then((res) => {
      setLoading(false);
      setTrendingTvsList((e) => [...e, ...res]);
      
    });
  }

   function navigateToAbout({ e }) {

    if (type === "Movies") {


      const id = trendingMoviesList[e].id;
      console.log(id)
      const genreId = trendingMoviesList[e].genre_ids[0];
      navigator(`/movie-info?movieid=${id}&genreid=${genreId}`);
    } else if (type === "TvShows") {

       const id = trendingTvsList[e].id;
      const genreId = trendingTvsList[e].genre_ids[0];
      navigator(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
    }
  }

  return (
     <CategoriesUi
            itemsList={type === "Movies" ? trendingMoviesList : trendingTvsList}
            morePage={morePage}
            isloading={loading}
            listType={type}
            setListType={setType}
            onItemsClick={(e)=>{
              navigateToAbout({e:e})
            }}
          ></CategoriesUi>
  );
}


export default Trending;
