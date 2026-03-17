import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  const token = localStorage.getItem("token");

  /* ---------------- FETCH USER ---------------- */

  useEffect(() => {

    if (!token) return;

    fetch("http://localhost:5000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => console.log(err));

  }, [token]);

  /* ---------------- CLOSE DROPDOWN ON OUTSIDE CLICK ---------------- */

  useEffect(() => {

    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  /* ---------------- LOGOUT ---------------- */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (

    <div className="flex justify-between items-center px-8 py-4 border-b bg-white shadow-sm">

      {/* LOGO */}

      <h1
        onClick={() => navigate("/upload")}
        className="font-bold text-lg cursor-pointer text-blue-600"
      >
        
      </h1>

      {token ? (

        <div className="relative" ref={dropdownRef}>

          {/* PROFILE BUTTON */}

          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer"
          >

            {/* Avatar */}

            {user?.avatar ? (

              <img
                src={user.avatar}
                alt="profile"
                className="w-10 h-10 rounded-full border"
              />

            ) : (

              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>

            )}

          </div>

          {/* DROPDOWN */}

          {open && (

            <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg p-4 z-50">

              {/* USER INFO */}

              <div className="flex items-center gap-3 mb-4">

                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="font-medium text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>

              </div>

              <hr className="mb-3" />

              {/* ACTIONS */}

              <button
                onClick={() => navigate("/upload")}
                className="w-full text-left text-sm py-2 hover:bg-gray-100 rounded px-2"
              >
                📁 My Files
              </button>

              <button
                onClick={logout}
                className="w-full text-left text-sm py-2 hover:bg-red-100 text-red-600 rounded px-2"
              >
                🚪 Logout
              </button>

            </div>

          )}

        </div>

      ) : (

        <button
          onClick={() => navigate("/signin")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>

      )}

    </div>

  );
}