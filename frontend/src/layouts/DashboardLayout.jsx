import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout() {

  return (

    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar */}

      <Sidebar />

      {/* Right Side */}

      <div className="flex-1 flex flex-col">

        {/* Navbar */}

        <Navbar />

        {/* Page Content */}

        <div className="px-16 py-10">
          <Outlet />
        </div>

      </div>

    </div>

  );

}