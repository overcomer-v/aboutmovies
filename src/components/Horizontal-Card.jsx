export function HorizontalCard({
  imgSrc,
  title,
  date,
  ratings,
  desc,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="flex h-fit gap-6 cursor-pointer items-center bg-neutral-900 py-4 px-4 rounded-lg"
    >
      <img
        className="w-fit h-32 md:h-44 rounded-lg"
        src={imgSrc}
        alt=""
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "./images/black_vertical_bg 2.jpg";
        }}
      />
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-xl">{title}</h2>
        <span className="w-[90%] mb-3 md:text-sm text-xs font-light opacity-50 line-clamp-3 ">
          {desc}
        </span>
        <div className="flex justify-between lg:gap-12">
          <p className="lg:text-base text-xs opacity-80">{date}</p>
          <div className="flex items-center gap-2 mr-12">
            <i
              className={`fa fa-star text-amber-500 lg:text-base text-xs ${
                ratings ? "" : "hidden"
              }`}
            ></i>
            <p className="lg:text-base text-xs opacity-80">
              {ratings ? ratings.toString().slice(0, 3) : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
