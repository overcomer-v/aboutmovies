import { useEffect, useState } from "react";
import { HorizontalCard } from "../components/Horizontal-Card";
import { fetchPopularMovies } from "../hooks/movies";
import { CategoriesUi } from "../components/CategriesUi";
import { fetchPopularTvs } from "../hooks/tvShows";
import { useLocation, useNavigate } from "react-router-dom";

function PopularPage() {
  const navigator = useNavigate();

  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const [popularTvsList, setPopularTvsList] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType ? reqType : "Movies";
  });

  useEffect(() => {
    loadPopularMovies();
  }, [moviesPageNo]);

  useEffect(() => {
    loadPopularTvs();
  }, [tvPageNo]);

  function loadPopularTvs() {
    setLoading(true);

    fetchPopularTvs(tvPageNo).then((res) => {
      setPopularTvsList((e) => [...e, ...res]);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }

  function morePage() {
    type === "Movies"
      ? setMoviesPageNo((e) => e + 1)
      : setTvPageNo((e) => e + 1);
  }

  function loadPopularMovies() {
    setLoading(true);

    fetchPopularMovies(moviesPageNo).then((res) => {
      setPopularMoviesList((e) => [...e, ...res]);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }

   function navigateToAbout({ e }) {

    if (type === "Movies") {


      const id = popularMoviesList[e].id;
      console.log(id)
      const genreId = popularMoviesList[e].genre_ids[0];
      navigator(`/movie-info?movieid=${id}&genreid=${genreId}`);
    } else if (type === "TvShows") {

       const id = popularTvsList[e].id;
      const genreId = popularTvsList[e].genre_ids[0];
      navigator(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
    }
  }

  return (
    <CategoriesUi
      itemsList={type === "Movies" ? popularMoviesList : popularTvsList}
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

export default PopularPage;
