import { NavLink } from "react-router-dom";
import logo from "../assets/Fileflux1.png";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `px-8 py-3 ${
      isActive
        ? "text-blue-600 bg-blue-50 font-medium"
        : "text-gray-600"
    }`;

  return (
    <div className="w-64 bg-white border-r">
    <div className="px-8 py-6 flex items-center">
        <img
          src={logo}
          alt="FileFlux Logo"
          className="h-10 object-contain"
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <NavLink to="/upload" className={linkClass}>
          Upload
        </NavLink>

        <NavLink to="/files" className={linkClass}>
          History
        </NavLink>
      </div>
    </div>
  );
}
