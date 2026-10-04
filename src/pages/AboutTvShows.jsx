import { useLocation, useNavigate } from "react-router-dom";
import { GenreListCard } from "../components/CategoriesCard";
import { Subtitle } from "../components/Subtitle";
import { useTvsInfo } from "../hooks/tvShows";
import { MediumCard } from "../components/Medium-H-Card";
import { Spinner } from "../components/Spinner";
import { useEffect, useRef, useState } from "react";

export function AboutTvShows() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const tvId = queryParams.get("tvid");
  const tvGenreId = queryParams.get("tv-genreid");

  const tvDetails = useTvsInfo(tvId, tvGenreId);

  const REVIEWS_STEP = 5;
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_STEP);

  // Reset the count when the user opens a different show
  useEffect(() => {
    setVisibleReviews(REVIEWS_STEP);
  }, [tvId]);

  const {
    isLoading,
    tvInfo = {},
    genres = [],
    genreNames = [],
    casts = [],
    reviews = [],
    similarTvs = [],
    posterImages = [],
    backDropImages = [],
    tvTrailers = [],
  } = tvDetails;

  const formatDate = (date) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openTvShow = (show) => {
    if (!show) return;

    const id = show.id;
    const genreId = show.genre_ids?.[0] || tvGenreId;

    navigate(`/tvshow-info?tvid=${id}&tv-genreid=${genreId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner className="text-6xl opacity-85" />
      </div>
    );
  }

  if (!tvInfo?.id) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div
          className="
          mb-5 flex h-20 w-20
          items-center justify-center
          rounded-full bg-white/[0.04]
        "
        >
          <i className="fa fa-tv text-3xl text-white/20" />
        </div>

        <h1 className="text-2xl font-bold">TV show not found</h1>

        <p className="mt-2 text-sm text-white/40">
          We couldn't find information for this TV show.
        </p>
      </div>
    );
  }

  const backdropUrl = tvInfo.backdrop_path
    ? `https://image.tmdb.org/t/p/original/${tvInfo.backdrop_path}`
    : "./images/black_horizontal_bg 2.jpg";

  const posterUrl = tvInfo.poster_path
    ? `https://image.tmdb.org/t/p/w500/${tvInfo.poster_path}`
    : "./images/black_vertical_bg 2.jpg";

  const trailer = tvTrailers[0];

  return (
    <main className="pb-24">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        className="
        relative isolate
        min-h-[620px]
        overflow-hidden
        rounded-b-3xl
      "
      >
        {/* Backdrop */}
        <img
          src={backdropUrl}
          alt=""
          className="
            absolute inset-0 -z-20
            h-full w-full
            object-cover object-center
          "
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "./images/black_horizontal_bg 2.jpg";
          }}
        />

        {/* Cinematic overlays */}
        <div
          className="
          absolute inset-0 -z-10
          bg-black/55
        "
        />

        <div
          className="
          absolute inset-0 -z-10
          bg-gradient-to-r
          from-black
          via-black/75
          to-black/20
        "
        />

        <div
          className="
          absolute inset-0 -z-10
          bg-gradient-to-t
          from-[#0a0a0a]
          via-transparent
          to-black/30
        "
        />

        {/* Hero content */}
        <div
          className="
          mx-auto flex min-h-[620px]
          max-w-[1500px]
          items-end gap-6
          px-5 pb-8 pt-24
          sm:px-8
          md:items-center
          md:gap-10
          md:px-12
          md:pb-12
        "
        >
          {/* Poster */}
          <div className="hidden flex-shrink-0 md:block">
            <div
              className="
              group relative
              overflow-hidden
              rounded-2xl
              shadow-2xl
              shadow-black/60
            "
            >
              <img
                src={posterUrl}
                alt={tvInfo.name}
                className="
                  h-[430px] w-[285px]
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "./images/black_vertical_bg 2.jpg";
                }}
              />

              <div
                className="
                absolute inset-0
                bg-gradient-to-t
                from-black/50
                to-transparent
              "
              />
            </div>
          </div>

          {/* Information */}
          <div className="max-w-3xl">
            {/* Mobile poster */}
            <div className="mb-5 md:hidden">
              <img
                src={posterUrl}
                alt={tvInfo.name}
                className="
                  h-[250px] w-[170px]
                  rounded-2xl
                  object-cover
                  shadow-2xl
                  shadow-black/60
                "
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "./images/black_vertical_bg 2.jpg";
                }}
              />
            </div>

            {/* Meta */}
            <div
              className="
              mb-3 flex flex-wrap
              items-center gap-2
              text-xs text-white/60
              sm:text-sm
            "
            >
              <span
                className="
                flex items-center gap-1.5
                font-semibold text-white
              "
              >
                <i className="fa fa-star text-yellow-500" />
                {Number(tvInfo.vote_average || 0).toFixed(1)}
              </span>

              <span className="text-white/20">•</span>

              <span>{tvInfo.first_air_date?.slice(0, 4) || "Unknown"}</span>

              {tvInfo.number_of_seasons && (
                <>
                  <span className="text-white/20">•</span>

                  <span>
                    {tvInfo.number_of_seasons}{" "}
                    {tvInfo.number_of_seasons === 1 ? "Season" : "Seasons"}
                  </span>
                </>
              )}

              {tvInfo.status && (
                <>
                  <span className="text-white/20">•</span>

                  <span>{tvInfo.status}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1
              className="
              mb-3
              font-nunito
              text-3xl
              font-extrabold
              leading-tight
              tracking-tight
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
            "
            >
              {tvInfo.name}
            </h1>

            {/* Tagline */}
            {tvInfo.tagline && (
              <p
                className="
                mb-4
                text-sm italic
                text-white/50
                md:text-base
              "
              >
                "{tvInfo.tagline}"
              </p>
            )}

            {/* Overview */}
            <p
              className="
              hidden max-w-2xl
              text-sm leading-7
              text-white/65
              md:block
            "
            >
              {tvInfo.overview || "No overview available for this TV show."}
            </p>

            {/* Genres */}
            {genres.length > 0 && (
              <div
                className="
                mt-5 hidden
                flex-wrap gap-2
                md:flex
              "
              >
                {genres.slice(0, 5).map((item) => (
                  <GenreListCard key={item.id} label={item.name} />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2
                    rounded-full
                    bg-red-500
                    px-6 py-3
                    text-sm font-bold text-white
                    shadow-lg
                    shadow-red-500/20
                    transition-all duration-200
                    hover:bg-red-600
                    hover:scale-[1.02]
                    active:scale-95
                  "
                >
                  <i className="fa fa-play text-xs" />
                  Watch Trailer
                </a>
              )}

              {tvInfo.homepage && (
                <a
                  href={tvInfo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center gap-2
                    rounded-full
                    border border-white/10
                    bg-white/[0.06]
                    px-6 py-3
                    text-sm font-semibold
                    text-white/80
                    backdrop-blur-md
                    transition-all duration-200
                    hover:border-white/20
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <i className="fa fa-external-link text-xs" />
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MOBILE GENRES + OVERVIEW
      ====================================================== */}
      <section className="px-3 md:hidden">
        {genres.length > 0 && (
          <div
            className="
            mt-5 flex gap-2
            overflow-x-auto no-scrollbar
          "
          >
            {genres.slice(0, 5).map((item) => (
              <GenreListCard key={item.id} label={item.name} />
            ))}
          </div>
        )}

        <Subtitle label="Overview" />

        <p
          className="
          text-sm leading-6
          text-white/60
        "
        >
          {tvInfo.overview || "No overview available."}
        </p>
      </section>

      {/* =====================================================
          CAST
      ====================================================== */}
      {casts.length > 0 && (
        <section className="mt-8 px-3">
          <Subtitle label="Cast" />

          <div
            className="
            flex gap-3
            overflow-x-auto no-scrollbar
          "
          >
            {casts.slice(0, 12).map((cast) => {
              const profile = cast.profile_path
                ? `https://image.tmdb.org/t/p/w500/${cast.profile_path}`
                : "./images/black_vertical_bg 2.jpg";

              return (
                <a
                  key={cast.id || cast.name}
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    cast.name,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group
                    flex w-[130px]
                    flex-shrink-0
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border border-white/[0.05]
                    bg-white/[0.03]
                    p-2
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-red-500/20
                    hover:bg-white/[0.05]
                    sm:w-[145px]
                    md:w-[150px]
                  "
                >
                  <div
                    className="
                    aspect-[3/4]
                    overflow-hidden
                    rounded-xl
                    bg-neutral-900
                  "
                  >
                    <img
                      src={profile}
                      alt={cast.name}
                      className="
                        h-full w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                      "
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "./images/black_vertical_bg 2.jpg";
                      }}
                    />
                  </div>

                  <div className="px-1 pb-1 pt-3">
                    <h3
                      className="
                      truncate text-sm
                      font-bold
                      group-hover:text-red-400
                    "
                    >
                      {cast.name}
                    </h3>

                    <p
                      className="
                      mt-1 truncate
                      text-xs text-white/40
                    "
                    >
                      {cast.character || "Unknown role"}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          SHOW INFORMATION
      ====================================================== */}
      <section className="mt-10 px-3">
        <Subtitle label="Show Info" />

        <div
          className="
          grid grid-cols-1
          overflow-hidden
          rounded-2xl
          border border-white/[0.05]
          bg-white/[0.025]
          sm:grid-cols-2
          lg:grid-cols-4
        "
        >
          <InfoCard
            title="First Air Date"
            label={formatDate(tvInfo.first_air_date)}
          />

          <InfoCard
            title="Last Air Date"
            label={formatDate(tvInfo.last_air_date)}
          />

          <InfoCard
            title="Seasons"
            label={
              tvInfo.number_of_seasons
                ? `${tvInfo.number_of_seasons} ${
                    tvInfo.number_of_seasons === 1 ? "Season" : "Seasons"
                  }`
                : "Unknown"
            }
          />

          <InfoCard
            title="Episodes"
            label={
              tvInfo.number_of_episodes
                ? `${tvInfo.number_of_episodes} Episodes`
                : "Unknown"
            }
          />

          <InfoCard title="Status" label={tvInfo.status || "Unknown"} />

          <InfoCard
            title="Languages"
            label={
              tvInfo.spoken_languages?.length
                ? tvInfo.spoken_languages
                    .map((language) => language.english_name)
                    .join(", ")
                : "Unknown"
            }
          />

          <InfoCard
            title="Genres"
            label={genreNames.length ? genreNames.join(", ") : "Unknown"}
          />

          <InfoCard
            title="Networks"
            label={
              tvInfo.networks?.length
                ? tvInfo.networks
                    .slice(0, 2)
                    .map((network) => network.name)
                    .join(", ")
                : "Unknown"
            }
          />

          <InfoCard title="Type" label={tvInfo.type || "Unknown"} />

          <InfoCard
            title="Origin Country"
            label={
              tvInfo.origin_country?.length
                ? tvInfo.origin_country.join(", ")
                : "Unknown"
            }
          />

          <InfoCard
            title="Production"
            label={
              tvInfo.production_companies?.length
                ? tvInfo.production_companies
                    .slice(0, 2)
                    .map((company) => company.name)
                    .join(", ")
                : "Unknown"
            }
          />

          <InfoCard
            title="Official Site"
            label={tvInfo.homepage ? "Available" : "Not available"}
            href={tvInfo.homepage}
          />
        </div>
      </section>

      {/* =====================================================
          REVIEWS
      ====================================================== */}
   
      {reviews.length > 0 && (
        <section className="mt-10 px-3">
          <Subtitle label="Reviews" />

          <div className="columns-1 gap-4 lg:columns-2">
            {" "}
            {reviews.slice(0, visibleReviews).map((review) => (
              <ReviewCard
                key={review.id || review.author}
                username={review.author}
                date={review.created_at}
                content={review.content}
              />
            ))}
          </div>

          {reviews.length > REVIEWS_STEP && (
            <div className="mt-5 flex justify-center gap-3">
              {visibleReviews > REVIEWS_STEP && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleReviews((prev) => {
                      const shown = Math.min(prev, reviews.length);
                      const previousBatch =
                        Math.ceil(shown / REVIEWS_STEP) * REVIEWS_STEP -
                        REVIEWS_STEP;
                      return Math.max(REVIEWS_STEP, previousBatch);
                    })
                  }
                  className="
              flex items-center gap-2
              rounded-full border border-white/10
              px-6 py-2.5
              text-sm font-semibold text-white/50
              transition-all duration-200
              hover:border-white/20
              hover:text-white/80
              active:scale-95
            "
                >
                  Show less
                  <i className="fa fa-chevron-up text-xs" />
                </button>
              )}

              {visibleReviews < reviews.length && (
                <button
                  type="button"
                  onClick={() =>
                    setVisibleReviews((prev) => prev + REVIEWS_STEP)
                  }
                  className="
              flex items-center gap-2
              rounded-full border border-white/10
              bg-white/[0.06] px-6 py-2.5
              text-sm font-semibold text-white/80
              transition-all duration-200
              hover:border-white/20
              hover:bg-white/10 hover:text-white
              active:scale-95
            "
                >
                  Show more (
                  {Math.min(REVIEWS_STEP, reviews.length - visibleReviews)})
                  <i className="fa fa-chevron-down text-xs" />
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          PICTURES + TRAILERS
      ====================================================== */}
      {(posterImages.length > 0 ||
        backDropImages.length > 0 ||
        tvTrailers.length > 0) && (
        <section className="mt-10 px-3">
          <div
            className="
            grid gap-8
            lg:grid-cols-[1fr_360px]
          "
          >
            {/* Pictures */}
            {backDropImages.length > 0 && (
              <div>
                <Subtitle label="Pictures" />

                <div
                  className="
                  grid grid-cols-2
                  gap-2 sm:gap-3
                "
                >
                  {backDropImages.slice(0, 4).map((image, index) => (
                    <div
                      key={image.file_path}
                      className={`
                          overflow-hidden
                          rounded-xl
                          ${
                            index === 0
                              ? "col-span-2 aspect-video"
                              : "aspect-video"
                          }
                        `}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w780/${image.file_path}`}
                        alt=""
                        className="
                            h-full w-full
                            object-cover
                            transition-transform
                            duration-500
                            hover:scale-105
                          "
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers */}
            {tvTrailers.length > 0 && (
              <div>
                <Subtitle label="Trailers" />

                <div
                  className="
                  flex flex-col gap-4
                "
                >
                  {tvTrailers.slice(0, 2).map((trailerItem) => (
                    <a
                      key={trailerItem.key}
                      href={`https://www.youtube.com/watch?v=${trailerItem.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                          group relative
                          overflow-hidden
                          rounded-2xl
                          border border-white/[0.06]
                        "
                    >
                      <img
                        src={`https://img.youtube.com/vi/${trailerItem.key}/hqdefault.jpg`}
                        alt={trailerItem.name || "Trailer"}
                        className="
                            aspect-video
                            h-full w-full
                            object-cover
                            transition-transform
                            duration-500
                            group-hover:scale-105
                          "
                      />

                      <div
                        className="
                          absolute inset-0
                          flex items-center
                          justify-center
                          bg-black/25
                          transition-colors
                          group-hover:bg-black/40
                        "
                      >
                        <div
                          className="
                            flex h-14 w-14
                            items-center justify-center
                            rounded-full
                            bg-red-500
                            shadow-xl
                            shadow-red-500/30
                            transition-transform
                            duration-300
                            group-hover:scale-110
                          "
                        >
                          <i className="fa fa-play text-white" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =====================================================
          SIMILAR TV SHOWS
      ====================================================== */}
      {similarTvs.length > 0 && (
        <section className="mt-10">
          <div className="px-3">
            <Subtitle label="You Might Also Like" />
          </div>

          <div
            className="
            flex gap-4
            overflow-x-auto
            px-3 pb-4
            no-scrollbar
          "
          >
            {similarTvs.slice(0, 12).map((show) => (
              <div
                key={show.id}
                className="
                  w-[75%]
                  flex-shrink-0
                  sm:w-[45%]
                  md:w-[32%]
                  lg:w-[24%]
                "
              >
                <MediumCard
                  date={show.first_air_date}
                  imgSrc={
                    show.backdrop_path
                      ? `https://image.tmdb.org/t/p/w780/${show.backdrop_path}`
                      : "./images/black_horizontal_bg 2.jpg"
                  }
                  title={show.name}
                  desc={show.overview}
                  ratings={show.vote_average}
                  onClick={() => openTvShow(show)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function InfoCard({ title, label, href }) {
  return (
    <div
      className="
      border-b border-white/[0.05]
      p-5 sm:p-6
    "
    >
      <h3
        className="
        mb-1 text-sm
        font-semibold text-white/80
      "
      >
        {title}
      </h3>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-sm text-red-400
            hover:text-red-300
          "
        >
          {label}
        </a>
      ) : (
        <p
          className="
          line-clamp-2
          text-sm text-white/40
        "
        >
          {label || "Not available"}
        </p>
      )}
    </div>
  );
}

function ReviewCard({ username, date, content }) {
  const [open, setOpen] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef(null);

  const formattedDate = date ? new Date(date).toLocaleDateString() : "";

  // Only show the button if the text is actually being cut off
  useEffect(() => {
    const el = textRef.current;
    if (!el || open) return;
    setCanExpand(el.scrollHeight > el.clientHeight + 1);
  }, [content, open]);

  return (
   <article
  className="
    mb-4 w-full break-inside-avoid
    rounded-2xl
    border border-white/[0.05]
    bg-white/[0.025]
    p-5
  "
>
      <div className="mb-4 flex items-center gap-3">
        <div
          className="
            flex h-11 w-11
            flex-shrink-0
            items-center justify-center
            rounded-full
            bg-red-500/10
          "
        >
          <i className="fa fa-user text-red-400" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">
            {username || "Anonymous"}
          </h3>

          <p className="text-xs text-white/30">{formattedDate}</p>
        </div>
      </div>

      <p
        ref={textRef}
        className={`
          text-sm leading-6
          text-white/55
          whitespace-pre-line
          ${open ? "" : "line-clamp-5"}
        `}
      >
        {content || "No review content available."}
      </p>

      {(canExpand || open) && (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            mt-3 flex items-center gap-1.5
            text-xs font-semibold
            text-red-400 transition-colors
            hover:text-red-300
          "
        >
          {open ? "Show less" : "Show more"}
          <i
            className={`fa text-[10px] ${
              open ? "fa-chevron-up" : "fa-chevron-down"
            }`}
          />
        </button>
      )}
    </article>
  );
}
