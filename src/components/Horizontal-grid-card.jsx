export function HorizontalGridCard({ imgSrc, title, date, ratings, desc }) {
    return (
      <div className="flex lg:w-[450px] w-[350px] h-[300px]">
        <img className="w-[40%] object-cover h-full rounded-lg mr-4" src={imgSrc} alt="" />
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-xl font-nunito">{title}</h2>
          <p className="w-[90%] mb-3 text-sm opacity-70 truncate-multiline font-nunito">
            {desc}
          </p>
          <div className="flex justify-between lg:gap-12">
            <p className="lg:text-base text-xs opacity-80">{date}</p>
            <div className="flex items-center gap-2 mr-12">
              <i className="fa fa-star lg:text-base text-yellow-500 text-xs"></i>
              <p className="lg:text-base text-xs opacity-80 font-nunito">{ratings.toString().slice(0, 3)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  