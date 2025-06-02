import { useEffect, useState } from "react";
import { HorizontalCard } from "../components/Horizontal-Card";
import { fetchTopMovies } from "../hooks/movies";
import { fetchTopTvs } from "../hooks/tvShows";
import { CategoriesUi } from "../components/CategriesUi";
import { useLocation, useNavigate } from "react-router-dom";

function TopMoviesPage() {
  const navigator = useNavigate();

  const [topMoviesList, setTopMoviesList] = useState([]);
  const [topTvsList, setTopTvsList] = useState([]);

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
    loadToprMovies();
  }, [moviesPageNo]);

  useEffect(() => {
    loadToprTvs();
  }, [tvPageNo]);

  function morePage() {
    type === "Movies"
      ? setMoviesPageNo((e) => e + 1)
      : setTvPageNo((e) => e + 1);
  }

  function loadToprMovies() {
    setLoading(true);

    fetchTopMovies(moviesPageNo).then((res) => {
      setTopMoviesList((e) => [...e, ...res]);
      setLoading(false);
    });
  }

  function loadToprTvs() {
    setLoading(true);

    fetchTopTvs(tvPageNo).then((res) => {
      setTopTvsList((e) => [...e, ...res]);
      setLoading(false);
    });
  }

  function navigateToAbout({ e }) {

    if (type === "Movies") {


      const id = topMoviesList[e].id;
      console.log(id)
      const genreId = topMoviesList[e].genre_ids[0];
      navigator(`/movie-info?movieid=${id}&genreid=${genreId}`);
    } else if (type === "TvShows") {

       const id = topTvsList[e].id;
      const genreId = topTvsList[e].genre_ids[0];
      navigator(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
    }
  }
  return (
    <CategoriesUi
      itemsList={type === "Movies" ? topMoviesList : topTvsList}
      morePage={morePage}
      isloading={loading}
      listType={type}
      setListType={setType}
      onItemsClick={(e)=>{
        navigateToAbout({e:e});
      }}
    ></CategoriesUi>
  );
}

export default TopMoviesPage;
