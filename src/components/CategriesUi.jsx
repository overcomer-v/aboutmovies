import { HorizontalCard } from "./Horizontal-Card";
import { Spinner } from "./Spinner";

export function CategoriesUi({
  itemsList = [],
  isloading,
  morePage,
  listType,
  setListType,
  onItemsClick,
}) {
  if (isloading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner className="text-5xl opacity-80" />
      </div>
    );
  }

  console.log("TYPE:", listType);
  console.log("FIRST ITEM:", itemsList[0]);
  return (
    <main className="flex flex-col w-full">
      {/* Movie / TV switcher */}
      {setListType && <TypeTab type={listType} setType={setListType} />}

      {/* Results */}
      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-4
          lg:gap-5
          mt-5
          px-1
        "
      >
        {itemsList.length > 0 ? (
          itemsList.map((item, index) => {
            const isMovie = listType === "Movies";

            return (
              <HorizontalCard
                key={item.id + index}
                date={isMovie ? item.release_date : item.first_air_date}
                imgSrc={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
                    : undefined
                }
                title={isMovie ? item.title : item.name}
                desc={item.overview}
                ratings={item.vote_average}
                onClick={() => onItemsClick?.(item)}
              />
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center">
            <p className="text-white/40">No results found.</p>
          </div>
        )}
      </div>

      {/* Load more */}
      {itemsList.length > 0 && morePage && (
        <button
          onClick={morePage}
          className="
            group
            mx-auto
            mt-8
            flex
            items-center
            gap-2
            rounded-full
            border
            border-white/10
            bg-white/[0.04]
            px-7
            py-3
            text-sm
            font-semibold
            text-white/70
            transition-all
            duration-200
            hover:border-red-500/40
            hover:bg-red-500
            hover:text-white
            active:scale-95
          "
        >
          Load More
          <i
            className="
              fa fa-angle-down
              text-xs
              transition-transform
              duration-200
              group-hover:translate-y-0.5
            "
          />
        </button>
      )}
    </main>
  );
}

/* =========================================================
   MOVIE / TV TOGGLE
========================================================= */

function TypeTab({ type, setType }) {
  return (
    <div
      className="
      inline-flex
      w-fit
      items-center
      gap-1
      rounded-full
      border
      border-white/10
      bg-neutral-900/80
      p-1
    "
    >
      <button
        type="button"
        onClick={() => setType("Movies")}
        className={`
          rounded-full
          px-5 py-2
          text-sm font-semibold
          transition-all duration-200
          ${
            type === "Movies"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-white/50 hover:text-white"
          }
        `}
      >
        Movies
      </button>

      <button
        type="button"
        onClick={() => setType("TvShows")}
        className={`
          rounded-full
          px-5 py-2
          text-sm font-semibold
          transition-all duration-200
          ${
            type === "TvShows"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
              : "text-white/50 hover:text-white"
          }
        `}
      >
        TV Shows
      </button>
    </div>
  );
}
