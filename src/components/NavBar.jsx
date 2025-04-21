import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

  const [pickedOptionsKey, setPickedOptionsKey] = useState(0);

  return (
    <nav className="bg-neutral-900 w- h-[95vh] flex flex-col py-6 px-4 rounded-3xl sticky m-auto">
      <div className="brand-name flex items-center mb-4 gap-4">
        <i className="fa fa-bullseye text-xl"></i>
        <h2 className="font-semibold text-xl">
          About<span className="font-light opacity-[0.7]">Movies</span>
        </h2>
      </div>

      <span className="bg-white w-full h-[0.5px] my-4 opacity-[0.2]"></span>

      <NavOptionsCard
        label={"Home"}
        iconClass={"fa-home"}
        id={0}
        to={"/"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Recently"}
        iconClass={"fa-clock"}
        id={1}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Trending"}
        iconClass={"fa-tv-alt"}
        id={2}
        to={"/trendings"}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Popular"}
        iconClass={"fa-video"}
        id={3}
      ></NavOptionsCard>
      <NavOptionsCard
        label={"Suggested"}
        iconClass={"fa-bullseye"}
        id={4}
      ></NavOptionsCard>

<span className="bg-white w-full h-[0.5px] my-4 opacity-[0.2]"></span>

<NavOptionsCard
        label={"About Us"}
        iconClass={"fa-bullseye"}
        id={4}
      ></NavOptionsCard>

<NavOptionsCard
        label={"Contact Us"}
        iconClass={"fa-bullseye"}
        id={4}
      ></NavOptionsCard>

    </nav>
  );

  function NavOptionsCard({ label, iconClass, id, to }) {
    let bgColor = "bg-transparent";
    if (pickedOptionsKey === id) {
      bgColor = "bg-neutral-800";
    }

    const navigate = useNavigate();

    return (
      <div
        key={id}
        onClick={() => {
          setPickedOptionsKey(id);
          navigate(to);
        }}
        className={`flex gap-7 items-center py-4 px-4 rounded-2xl mb-1 cursor-pointer ${bgColor}`}
      >
        <i className={`fa ${iconClass} w-5 text-[1.05rem]`}></i>
        <h5 className="font-semibold text-[1rem] text-start">{label}</h5>
      </div>
    );
  }
}



export default Navbar;
