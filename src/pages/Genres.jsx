import { useEffect, useState } from "react";
import { HorizontalCard } from "../components/Horizontal-Card";
import { fetchMovieGenres, fetchMoviesByGenres, fetchPopularMovies } from "../hooks/movies";
import { CategoriesUi } from "../components/CategriesUi";
import { fetchPopularTvs, fetchTvsByGenres } from "../hooks/tvShows";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GenreListCard } from "../components/CategoriesCard";

export function GenreOpener() {
  const navigator = useNavigate();
  const [genrelist, setGenreList] = useState([]);

  const [genremoviesList, setGenresMoviesList] = useState([]);
  const [genresTvList, setGenresTvlist] = useState([]);

  const [tvPageNo, setTvPageNo] = useState(1);
  const [moviesPageNo, setMoviesPageNo] = useState(1);
  const location = useLocation();
  const { genreId, genre } = useParams();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(() => {
    const queryParams = new URLSearchParams(location.search);
    const reqType = queryParams.get("type");

    return reqType ? reqType : "Movies";
  });
  useEffect(() => {
    loadGenreList();
  }, []);
  useEffect(() => {

    if (type === "Movies") {
       loadGenreMoviesList();
    }else{
      loadGenreTvList();
    }

  }, [moviesPageNo,tvPageNo,genreId,type]);

  

  function loadGenreList() {
    fetchMovieGenres().then((res) => setGenreList(res));
  }
  function loadGenreTvList() {
    setLoading(true);

    fetchTvsByGenres(genreId, tvPageNo).then((res) => {
      setGenresTvlist((e) => [...e, ...res]);
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

  function loadGenreMoviesList() {
    setLoading(true);

    fetchMoviesByGenres(genreId, moviesPageNo).then((res) => {
      setGenresMoviesList((e) => [...e, ...res]);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });
  }

  function navigateToAbout({ e }) {
    if (type === "Movies") {
      const id = genremoviesList[e].id;
      console.log(id);
      const genreId = genremoviesList[e].genre_ids[0];
      navigator(`/movie-info?movieid=${id}&genreid=${genreId}`);
    } else if (type === "TvShows") {
      const id = genresTvList[e].id;
      const genreId = genresTvList[e].genre_ids[0];
      navigator(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
    }
  }

  return (
    <div>
      <h1 className="text-3xl pl-3 mb-2">{`${genre}s`}</h1>
      <div className="flex my-4 gap-2 no-scrollbar overflow-x-auto mx-1">
        {genrelist.map((genre) => (
         
            <GenreListCard
              key={genre.id}
              label={genre.name}
              genreId={genre.id}
              onClick={()=>{setGenresMoviesList([]); setGenresTvlist([]);}}
            ></GenreListCard>
        
        ))}
      </div>
      <CategoriesUi
        itemsList={type === "Movies" ? genremoviesList : genresTvList}
        morePage={morePage}
        isloading={loading}
        listType={type}
        setListType={setType}
        onItemsClick={(e) => {
          navigateToAbout({ e: e });
        }}
      ></CategoriesUi>
    </div>
  );
}
