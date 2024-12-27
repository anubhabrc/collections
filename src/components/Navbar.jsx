import React from "react";
import dp from "../assets/dp.jpeg";
import { Link } from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full border-b z-50 bg-white">
      <div className="w-[95%] mx-auto py-2 flex items-center md:justify-between">
        <div className="flex gap-3 items-center">
          <Link to="/" className="text-xl font-bold text-black font-serif">
            Are you middle class? 💵
          </Link>
        </div>
        <div className="hidden md:block w-8 h-8 rounded-full overflow-hidden">
          <a
            href="https://www.anubhabrc.tech/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={dp}
              alt="User"
              className="w-full h-full object-cover cursor-pointer"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
