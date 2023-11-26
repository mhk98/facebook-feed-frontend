import React from "react";
import "./Header.css";

import { Link, useNavigate } from "react-router-dom";
const Header = () => {
  const token = localStorage.getItem("token");
  const image = localStorage.getItem("image");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };
  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src={`http://localhost:5000/${image}`}
            />
          </div>
        </div>
        <ul className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>

          {token ? (
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
