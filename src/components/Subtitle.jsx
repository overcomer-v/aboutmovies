import { useNavigate } from "react-router-dom";

export function Subtitle({ label, goToRoute }) {

  const navigator = useNavigate();

    return (
     <div className="flex justify-between items-center">
       <div className="flex gap-4 items-center my-6 h-10 ">
        <div className="bg-default w-4 h-full rounded-md"></div>
        <h2 className="font-bold lg:text-2xl text-2xl font-nunito">{label}</h2>
      </div>
     {
      goToRoute? <span className="flex px-5 py-3 rounded-xl bg-neutral-900" onClick={()=>{
        navigator(goToRoute);
      }}>
        <i className="fa fa-angle-right text-xl m-auto"></i>
      </span>:<></>
     }
     </div>
    );
  }
