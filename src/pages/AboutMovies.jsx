import { useLocation, useNavigate } from "react-router-dom";
import { GenreListCard } from "../components/CategoriesCard";
import { Subtitle } from "../components/Subtitle";
import { MediumCard } from "../components/Medium-H-Card";
import { useMoviesInfo } from "../hooks/movies";
import { useEffect } from "react";
import { Spinner } from "../components/Spinner";

export function AboutMovies() {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("movieid");
  const movieGenreId = queryParams.get("genreid");

  const movieDetails = useMoviesInfo(movieId, movieGenreId);
  const backDropImages = movieDetails.backDropImages;
  const posterImages = movieDetails.posterImages;
  const movieTrailers = movieDetails.movieTrailers;
  const movieInfo = movieDetails.movieInfo;

  useEffect(() => {
    console.log(movieDetails.similarMovies);
  }, [movieDetails]);

  return (
    <div className="pb-32">
      {movieDetails.isLoading ? (
       <Spinner className={"text-6xl opacity-85"}/>
      ) : (
        <div
          className="flex flex-col w-f
        ull h-fit"
        >
          <section
            id="p-info"
            className="md:h-[600px] h-[250px]  w-full relative"
          >
            <img
              className="w-full h-full object-cover "
              src={`https://image.tmdb.org/t/p/w500/${movieInfo.backdrop_path}`}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "./images/black_horizontal_bg 2.jpg";
              }}
            />{" "}
            <div className="h-full w-full gap-x-4 px-6  md:p-12 md:gap-x-12 items-center grid grid-cols-[40%_60%] md:grid-cols-[30%_70%] absolute top-0 bottom-0 bg-black bg-opacity-80">
              <div>
                <img
                  className="rounded-xl "
                  src={`https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
                  alt=""
                />
              </div>
              <div className="lg:p-12">
                <div className="flex md:mb-4 items-center  h-8 text-center [&_p]:text-xs flex-wrap">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-star text-yellow-500"></i>
                    <p className=" text-sm lg:text-base">
                      {" "}
                      {movieInfo.vote_average}
                    </p>
                  </div>
                  <span className="mx-3 font-bold text-2xl  leading-none">
                    ·
                  </span>
                  <p>{movieInfo.release_date}</p>

                  <p className="hidden md:block">
                    <span className="mx-3 font-bold text-2xl">·</span>2h50m
                  </p>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold md:mb-4 mb-1 tracking-widest">
                  {" "}
                  {movieInfo.title}
                </h1>
                <p className="text-sm hidden md:block">
                  {/* Since the publication of the third edition of Engineering
            Mathematics, considerable changes in the syllabus and options for
            A-level qualifications in Mathematics have been introduced
            nationally, as a result of which numbers of students with various
            levels of mathematical background have been enrolling for
            undergraduate courses in engineering and science. */}
                  {movieInfo.overview}
                </p>

                <div className="md:flex gap-3 md:mt-4 flex-wrap hidden">
                  {movieDetails.genres.slice(0, 5).map((genre, index) => (
                    <GenreListCard
                      key={index}
                      label={genre.name}
                    ></GenreListCard>
                  ))}
                </div>
               {movieTrailers.length > 0 ? <a
                  className="bg-default w-fit rounded-3xl px-6 py-2 md:mt-4 mt-8 flex items-center gap-2"
                  href={`https://www.youtube.com/watch?v=${movieTrailers[0].key}`}
                >
                  <i className="fa fa-play"></i>
                  <p className="text-sm lg:text-base">Trailer</p>
                </a>: <></>}
              </div>
            </div>
          </section>

          <section>
            <div className="flex gap-3 mt-4 flex-wrap md:hidden">
              {movieDetails.genres.slice(0, 5).map((genre, index) => (
                <GenreListCard key={index} label={genre.name}></GenreListCard>
              ))}
            </div>
          </section>

          <section className="flex-col md:hidden px-2">
            <Subtitle label={"Overview"}></Subtitle>
            <p className="text-sm ">{movieInfo.overview}</p>
            <p className="opacity-60 mt-2 text-sm">Duration : 2h50m</p>
          </section>

          <section id="casts-sec" className="flex flex-col px-2">
            <Subtitle label={"Casts"}></Subtitle>

            <div className="flex gap-x-2 no-scrollbar overflow-x-auto ">
              {movieDetails.casts.slice(0, 10).map((cast, index) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/search?q=${cast.name}`}
                  key={index}
                  className="flex flex-col flex-shrink-0 transition-transform duration-300 hover:scale-95 w-[35%] md:w-[16%] h-fit p-4 bg-neutral-900 bg-opacity-50 rounded-xl items-center"
                >
                  <img
                    className="mb-3 rounded-md"
                    src={`https://image.tmdb.org/t/p/w500/${cast.profile_path}`}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "./images/black_vertical_bg 2.jpg";
                    }}
                  />

                  <h1 className="font-bold line-clamp-1">{cast.name}</h1>
                  <p className="font-normal text-sm line-clamp-1">
                    {" "}
                    {cast.character}
                  </p>
                </a>
              ))}
            </div>

            <div className="w-full flex justify-center mt-4">
              <button className="bg-default text-sm lg:text-base w-fit rounded-3xl px-6 py-2  flex items-center gap-2 ">
                Show All
              </button>
            </div>
          </section>

          <section className="info-secn px-2">
            <Subtitle label={"More Info"}></Subtitle>
            <div className="grid md:grid-cols-3 grid-cols-1 gap-4 bg-[rgb(15,15,15)] p-6 rounded-lg ">
              <InfoCard title={"Languages"} label={"English"}></InfoCard>
              <InfoCard
                title={"Release Date"}
                label={movieInfo.release_date}
              ></InfoCard>
              <InfoCard title={"Revenue"} label={movieInfo.revenue}></InfoCard>
              <InfoCard title={"Budget"} label={movieInfo.budget}></InfoCard>
              <InfoCard title={"Status"} label={movieInfo.status}></InfoCard>
              <InfoCard title={"Tag"} label={movieInfo.tagline}></InfoCard>
              <InfoCard
                title={"Ofiicial Sites"}
                label={movieInfo.homepage}
              ></InfoCard>
              <InfoCard
                title={"Tags"}
                label={movieDetails.genreNames.join(" ,")}
              ></InfoCard>
            </div>
          </section>

          <section className="flex flex-col px-2 ">
            {!movieDetails.reviews.length > 0 ? (
              <div></div>
            ) : (
              <div className="flex relative">
                <section className="w-full">
                  <Subtitle label={"Reviews"}></Subtitle>
                  <div className="flex gap-x-2 overflow-x-auto no-scrollbar">
                    {movieDetails.reviews.slice(0, 2).map((review) => (
                      <ReviewCard
                        modify={
                          movieDetails.reviews.length > 1
                            ? "md:w-1/2"
                            : "md:w-full"
                        }
                        username={review.author}
                        date={review.created_at}
                        content={review.content}
                      ></ReviewCard>
                    ))}
                  </div>
                </section>
                {/* <div className="h-full w-64 bg-gradient-to-r from-transparent to-black absolute right-0"></div> */}
              </div>
            )}

            <section
              id="pics-and-trailers"
              className={`grid ${
                movieTrailers.length === 0
                  ? "md:grid-cols-1 "
                  : "md:grid-cols-[68%_30%]"
              } gap-6 px-2`}
            >
              <div id="pics-sec" className="w-full">
                <Subtitle label={"Pictures"}></Subtitle>
                <div className="flex flex-col gap-2 [&_img]:object-cover w-full">
                  {posterImages.length > 0 ? (
                    <div className="flex gap-2">
                      <img
                        className="w-[28%]"
                        src={`https://image.tmdb.org/t/p/w500/${posterImages[0].file_path}`}
                        alt=""
                      />
                      <img
                        className="w-[69%]"
                        src={`https://image.tmdb.org/t/p/w500/${backDropImages[0].file_path}`}
                        alt=""
                      />
                    </div>
                  ) : (
                    <></>
                  )}

                  {backDropImages.length > 1 ? (
                    <div className="flex gap-2">
                      <img
                        className="w-[69%]"
                        src={`https://image.tmdb.org/t/p/w500/${backDropImages[1].file_path}`}
                        alt=""
                      />
                      <img
                        className="w-[28%]"
                        src={`https://image.tmdb.org/t/p/w500/${posterImages[1].file_path}`}
                        alt=""
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {movieTrailers.length > 0 ? (
                <div className="trailers-sec flex flex-col gap-4 [&img]:rounded-lg">
                  <Subtitle label={"Trailers"}></Subtitle>
                  <a
                    className="relative"
                    href={`https://www.youtube.com/watch?v=${movieTrailers[0].key}`}
                  >
                    <img
                      className="border-neutral-300 border-2 rounded-3xl"
                      src={`https://img.youtube.com/vi/${movieTrailers[0].key}/0.jpg`}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "./images/black_vertical_bg 2.jpg";
                      }}
                    />
                    <i className="fab fa-youtube absolute top-[38%] left-[38%] color-default bg-white rounded-2xl text-[5rem]"></i>
                  </a>

                  {movieTrailers.length > 1 ? (
                    <a
                      className="relative"
                      href={`https://www.youtube.com/watch?v=${movieTrailers[1].key}`}
                    >
                      <img
                        className="border-neutral-300 border-2 rounded-3xl"
                        src={`https://img.youtube.com/vi/${movieTrailers[1].key}/0.jpg`}
                        alt=""
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "./images/black_vertical_bg 2.jpg";
                        }}
                      />
                      <i className="fab fa-youtube absolute top-[38%] left-[38%] color-default bg-white rounded-2xl text-[5rem]"></i>
                    </a>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : (
                <div></div>
              )}
            </section>
          </section>

          <Subtitle label={"Similars"}></Subtitle>
          <div className="flex gap-x-3 mb-8 no-scrollbar overflow-x-auto">
            {movieDetails.similarMovies
              .slice(0, 11)
              .map((similarMovie, index) => (
                <MediumCard
                  key={index}
                  date={similarMovie.release_date}
                  imgSrc={`https://image.tmdb.org/t/p/w500/${similarMovie.backdrop_path}`}
                  title={similarMovie.title}
                  desc={similarMovie.overview}
                  ratings={similarMovie.vote_average}
                  onClick={function () {
                    navigateTo(
                      `/movie-info?movieid=${similarMovie.id}&genreid=${similarMovie.genre_ids[0]}`
                    );

                    window.location.reload();
                  }}
                ></MediumCard>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  function InfoCard({ title, label }) {
    return (
      <div className="flex flex-col gap-2 py-4 md:px-8 px-4 rounded-lg">
        <h2 className="font-bold md:text-lg text-base">{title}</h2>
        <span className="font-[300] text-sm opacity-70">{label}</span>
      </div>
    );
  }

  function ReviewCard({ username, date, imgsrc, content, modify }) {
    return (
      <div
        className={`flex w-[80%] ${modify} flex-shrink-0 flex-col gap-4 bg-[rgb(15,15,15)] p-6 rounded-lg`}
      >
        <div className="flex gap-4 items-center">
          <img
            className="w-16 h-16 rounded-full"
            src=".\images\desktop-wallpaper-spiderman-amoled-balck.jpg"
            alt=""
          />
          <div className="flex flex-col">
            <h1>{username}</h1>
            <span className="opacity-60 font-[300] text-sm">{date}</span>
          </div>
        </div>
        <div>
          <span className="font-light text-sm line-clamp-5">{content}</span>
          <span className="font-light text-sm underline">show more</span>
        </div>
      </div>
    );
  }
}
