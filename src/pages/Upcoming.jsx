import { useEffect, useState } from "react";
import { HorizontalCard } from "../components/Horizontal-Card";
import { fetchUpcomingMovies } from "../hooks/movies";
import { CategoriesUi } from "../components/CategriesUi";
import { useNavigate } from "react-router-dom";

function UpcomingPage() {
  const navigator = useNavigate();

  const [upcomingMoviesList, setUpcomingMoviesList] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpcomingMovies(pageNo);
  }, [pageNo]);

  function morePage() {
    setPageNo((e) => e + 1);
  }

  function loadUpcomingMovies(pageNo) {
    setLoading(true);

    setTimeout(() => {
      fetchUpcomingMovies(pageNo).then((res) => {
        setUpcomingMoviesList((e) => [...e, ...res]);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
        console.log(res);
      });
    }, 2000);
  }

   function navigateToAbout({ e }) {

      const id = upcomingMoviesList[e].id;
      console.log(id)
      const genreId = upcomingMoviesList[e].genre_ids[0];
      navigator(`/movie-info?movieid=${id}&genreid=${genreId}`);
   
  }

  return (
    <CategoriesUi
      itemsList={upcomingMoviesList}
      listType={"Movies"}
      morePage={morePage}
      isloading={loading}
      onItemsClick={(index)=>{
        navigateToAbout({e:index});
      }}
    ></CategoriesUi>
  );
}

export default UpcomingPage;
