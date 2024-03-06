import React from "react";

//import logo from "./images/642bf9a0bcb92.jpg";

export default function SupportPanelHead({ setSupportOn1 }) {
  return (
    <div>
      <div className="flex gap-1">
        {" "}
        <span className="p-2   hover: text-slate-700" onClick={setSupportOn1}>
          X
        </span>
        <div className="flex gap-1 text-2xl w-full bg-gradient-to-r from-cyan-500 to-blue-500 dark:bg-blue-700 text-white p-2 rounded-xl ">
          {" "}
          <div className="flex gap-4 items-center ">
            {" "}
            <img
              src={"https://aris888.io/images/aris888.com.png"}
              className=" p-4 w-24 h-24  rounded-full"
              alt="Logo"
            />
            <span className="p-2  text-nowrap">Aris888</span>
          </div>
        </div>
      </div>
    </div>
  );
}
