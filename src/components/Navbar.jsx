import React, { useState } from "react";
import dp from "../assets/dp.jpeg";
import { LiaSkullCrossbonesSolid } from "react-icons/lia";
import { PiHamburgerLight } from "react-icons/pi";
import { Link, useRouterState } from "@tanstack/react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const routerState = useRouterState();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isLinkActive = (path) => {
    return routerState.location.pathname === path;
  };

  // Helper function to get link class names
  const getLinkClasses = (path) => {
    const isActive = isLinkActive(path);
    return `text-sm font-serif ${
      isActive ? "text-black font-medium" : "text-gray-500 hover:text-black"
    }`;
  };

  return (
    <div className="fixed top-0 left-0 w-full border-b z-50 bg-white">
      <div className="w-[95%] mx-auto py-2 flex items-center justify-between">
        {/* Left Side - Logo and Links */}
        <div className="flex gap-10 items-center">
          <Link to="/" className="text-xl font-bold text-black font-serif">
            Collections ✨
          </Link>
          <div className="hidden md:flex space-x-10">
            <Link to="/" className={getLinkClasses("/")}>
              Are you middle class?
            </Link>
            <Link
              to="/stacks-of-cash"
              // className="text-gray-500 text-sm hover:text-black font-serif"
              className={getLinkClasses("/stacks-of-cash")}
            >
              Stacks of Cash
            </Link>
            <a
              href="https://www.anubhabrc.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-sm hover:text-black font-serif"
            >
              Portfolio
            </a>
          </div>
        </div>

        {/* Right Side - Profile Photo (Hidden on mobile) */}
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

        {/* Hamburger Icon for Mobile */}
        <div className=" md:hidden ">
          <button onClick={toggleSidebar}>
            <PiHamburgerLight className="h-6 w-6 text-black cursor-pointer pt-1" />
          </button>
        </div>
      </div>

      {/* Overlay - Darkens the background when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Slide-in from the right */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-64 z-50`}
      >
        <div className="p-4">
          <div className="flex justify-between mb-6">
            <button onClick={toggleSidebar}>
              <LiaSkullCrossbonesSolid className="h-6 w-6 text-black cursor-pointer" />
            </button>
            <div className="w-7 h-7 rounded-full overflow-hidden">
              <a
                href="https://www.anubhabrc.tech/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeSidebar}
              >
                <img
                  src={dp}
                  alt="User"
                  className="w-full h-full object-cover cursor-pointer"
                />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 space-y-4">
            <h3 className="text-black font-serif font-semibold">Quick links</h3>
            <Link to="/" className={getLinkClasses("/")} onClick={closeSidebar}>
              Are you middle class?
            </Link>
            <Link
              to="/stacks-of-cash"
              className={getLinkClasses("/stacks-of-cash")}
              onClick={closeSidebar}
            >
              Stacks of Cash
            </Link>
            <a
              href="https://www.anubhabrc.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 text-sm font-serif"
              onClick={closeSidebar}
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
