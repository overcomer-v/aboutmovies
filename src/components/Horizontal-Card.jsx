export function HorizontalCard({
  imgSrc,
  title,
  date,
  ratings,
  desc,
  onClick,
}) {
  return (
    <article
      onClick={onClick}
      className="
        group
        relative
        flex
        min-h-[170px]
        w-full
        cursor-pointer
        gap-4
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.06]
        bg-neutral-900/80
        p-3
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-red-500/20
        hover:bg-neutral-900
      "
    >
      {/* Poster */}
      <div
        className="
          relative
          h-[150px]
          w-[100px]
          flex-shrink-0
          overflow-hidden
          rounded-xl
          bg-neutral-800
          sm:h-[175px]
          sm:w-[115px]
        "
      >
        <img
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          src={
            imgSrc ||
            "./images/black_vertical_bg 2.jpg"
          }
          alt={title || "Movie poster"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "./images/black_vertical_bg 2.jpg";
          }}
        />

        {/* Image overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/50
            to-transparent
          "
        />

        {/* Rating */}
        {ratings != null && (
          <div
            className="
              absolute
              bottom-2
              left-2
              flex
              items-center
              gap-1
              rounded-full
              bg-black/75
              px-2
              py-1
              text-[11px]
              font-semibold
              backdrop-blur-md
            "
          >
            <i className="fa fa-star text-yellow-500" />

            <span>
              {Number(ratings).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">

        <div>
          <h2
            className="
              mb-1
              truncate
              pr-2
              font-nunito
              text-base
              font-bold
              leading-tight
              sm:text-lg
              transition-colors
              duration-200
              group-hover:text-red-400
            "
          >
            {title}
          </h2>

          <p className="mb-2 text-xs text-white/40">
            {date
              ? date.slice(0, 4)
              : "Unknown"}
          </p>

          <p
            className="
              line-clamp-3
              pr-1
              text-xs
              leading-relaxed
              text-white/50
              sm:text-sm
            "
          >
            {desc || "No description available."}
          </p>
        </div>

        {/* Bottom action */}
        <div className="mt-3 flex items-center justify-between gap-2">

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-white/60
              transition-all
              duration-200
              hover:border-red-500/30
              hover:bg-red-500
              hover:text-white
              sm:px-4
              sm:py-2
              sm:text-xs
            "
          >
            More Info

            <i className="fa fa-angle-right" />
          </button>

          {/* Mobile rating */}
          {ratings != null && (
            <div className="flex items-center gap-1 text-xs text-white/40 sm:hidden">
              <i className="fa fa-star text-yellow-500" />

              {Number(ratings).toFixed(1)}
            </div>
          )}
        </div>
      </div>

      {/* Red hover accent */}
      <div
        className="
          absolute
          left-0
          top-4
          h-12
          w-0.5
          rounded-r-full
          bg-red-500
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />
    </article>
  );
}
