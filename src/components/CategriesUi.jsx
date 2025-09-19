import { useEffect, useState } from "react";
import { fetchMovieGenres } from "../hooks/movies";
import { HorizontalCard } from "./Horizontal-Card";
import { GenreListCard } from "./CategoriesCard";
import { Spinner } from "./Spinner";

export function CategoriesUi({
  itemsList,
  isloading,
  morePage,
  listType,
  setListType,
  onItemsClick,
}) {
  const [genrelist, setGenreList] = useState([]);

  useEffect(() => {
    loadGenreList();
  });

  function loadGenreList() {
    fetchMovieGenres().then((res) => setGenreList(res));
  }
  return (
    <>
      {" "}
      {isloading ? (
        <Spinner className={"text-5xl opacity-80"}/>
      ) : (
        <main className="flex flex-col">
          {setListType ? (
            <TypeTab type={listType} setType={setListType}></TypeTab>
          ) : (
            ""
          )}
          <div className="flex my-4 gap-2 no-scrollbar overflow-x-auto mx-1">
            {genrelist.map((genre) => (
              <GenreListCard key={genre.id} label={genre.name}></GenreListCard>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4 mx-1">
            {" "}
            {itemsList.map((items, index) => (
              <HorizontalCard
                key={index}
                date={
                  listType === "Movies"
                    ? items.release_date
                    : items.first_air_date
                }
                imgSrc={`https://image.tmdb.org/t/p/w500/${items.poster_path}`}
                title={listType === "Movies" ? items.title : items.name}
                desc={items.overview}
                ratings={items.vote_average}
                onClick={() => {
                  onItemsClick ? onItemsClick(index) : {};
                }}
              ></HorizontalCard>
            ))}
          </div>
          <button
            className="px-8 py-4 bg-default mx-auto my-6 rounded-lg font-bold"
            onClick={morePage}
          >
            Load More
          </button>
        </main>
      )}
    </>
  );
}

function TypeTab({ type, setType }) {
  return (
    <div
      className={`flex gap-x-4 mt-4 px-2 [&_h4]:px-4 [&_h4]:py-2 [&_h4]:md:px-6 [&_h4]:md:py-3 [&_h4]:rounded-lg [&_h4]:cursor-pointer `}
    >
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
