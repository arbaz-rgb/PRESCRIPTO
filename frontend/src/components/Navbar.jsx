import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
     
      <img className="w-44 cursor-pointer" src={assets.logo} alt="logo" />

    {/* links */}
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `py-1 ${
                isActive ? "border-b-2 border-[#5f6FFF] text-[#5f6FFF]" : ""
              }`
            }
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              `py-1 ${
                isActive ? "border-b-2 border-[#5f6FFF] text-[#5f6FFF]" : ""
              }`
            }
          >
            ALL DOCTORS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `py-1 ${
                isActive ? "border-b-2 border-[#5f6FFF] text-[#5f6FFF]" : ""
              }`
            }
          >
            ABOUT
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `py-1 ${
                isActive ? "border-b-2 border-[#5f6FFF] text-[#5f6FFF]" : ""
              }`
            }
          >
            CONTACT
          </NavLink>
        </li>
      </ul>

      {/* Button */}
      
      <div className="flex item-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt="Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />

            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-[12rem] bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="hover:text-black cursor-pointer"
                >
                  {" "}
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full hidden md:block"
          >
            Create account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
