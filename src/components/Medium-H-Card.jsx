import { Link } from "react-router-dom";

export function MediumCard({ imgSrc, title, date, desc, ratings,onClick }) {
    return (
      <div className="lg:w-1/3 w-2/3 flex flex-col cursor-pointer justify-between flex-shrink-0 " onClick={onClick}>
        <img
          className="w-full object-cover  rounded-2xl mb-3"
          src={imgSrc}
          alt=""
        />
        {/* <div className="bg-black w-full h-full absolute opacity-50"></div> */}
        <div className=" flex flex-col lg:h-[230px] h-[160px]">
          {" "}
          <div className="flex justify-between mr-6 mb-1 mt-2 gap-4">
            <h1 className="font-bold lg:text-xl mb-1 text-base font-nunito trunicate-oneline">
              {title}
            </h1>
            <p className="opacity-50 text-sm lg:text-base">{date.slice(0, 4)}</p>
          </div>
          <div className="lg:truncate-multiline truncate-threeline w-[90%] mb-3 text-xs lg:text-base opacity-70">
            {desc}{" "}
          </div>
          <div className="flex justify-between">
            <button className="bg-default w-fit rounded-3xl px-6 py-2  flex items-center gap-2">
              <i className="fa fa-angle-right"></i>
              <p className="text-sm lg:text-base">More Info</p>
            </button>
  
            <div className="flex items-center gap-2 mr-12">
              <i className="fa fa-star text-yellow-500"></i>
              <p className=" text-sm lg:text-base">
                {ratings.toString().slice(0, 3)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }