export function MediumCard({ imgSrc, title, date, desc, ratings, onClick }) {
  return (
    <article
      onClick={onClick}
      className="
        group
        w-2/3
        lg:w-full
        flex-shrink-0
        cursor-pointer
        overflow-hidden
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      {/* Image */}
      <div
        className="
          relative
          w-full
          aspect-video
          overflow-hidden
          rounded-2xl
          bg-neutral-900
          mb-4
        "
      >
        <img
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
          src={imgSrc}
          alt={title}
          loading="lazy"
        />

        {/* Image gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-transparent
            to-transparent
            opacity-70
          "
        />

        {/* Rating badge */}
        <div
          className="
            absolute
            top-3
            right-3
            flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/10
            bg-black/70
            px-2.5
            py-1
            text-xs
            font-semibold
            backdrop-blur-md
          "
        >
          <i className="fa fa-star text-yellow-500" />

          <span>{Number(ratings || 0).toFixed(1)}</span>
        </div>
        
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {/* Title + year */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2
            className="
              min-w-0
              truncate
              font-nunito
              text-base
              lg:text-xl
              font-bold
              leading-tight
              transition-colors
              duration-200
              group-hover:text-red-400
            "
          >
            {title}
          </h2>

          <span
            className="
              flex-shrink-0
              text-xs
              lg:text-sm
              text-white/40
            "
          >
            {date?.slice(0, 4)}
          </span>
        </div>

        {/* Description */}
        <p
          className="
            mb-4
            w-[95%]
            text-xs
            lg:text-sm
            leading-relaxed
            text-white/55
            line-clamp-3
          "
        >
          {desc || "No description available."}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/[0.04]
              px-4
              py-2
              text-xs
              lg:text-sm
              font-semibold
              text-white/80
              transition-all
              duration-200
              hover:border-red-500/40
              hover:bg-red-500
              hover:text-white
            "
          >
            More Info
            <i
              className="
                fa fa-angle-right
                text-xs
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
            />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <i className="fa fa-star text-yellow-500" />
            <span>{Number(ratings || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
