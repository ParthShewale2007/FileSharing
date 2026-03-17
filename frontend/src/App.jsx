import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Upload from "./pages/Upload";
import UploadSuccess from "./pages/UploadSuccess";
import Files from "./pages/Files";
import Download from "./pages/Download";
import Analytics from "./pages/Analytics";
import SignUp from "./pages/SignUp"

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {

  return (

    <Routes>

      {/* Public Pages */}

      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/download/:id" element={<Download />} />

      {/* Dashboard Pages (with Navbar) */}

      <Route element={<DashboardLayout />}>

        <Route path="/upload" element={<Upload />} />
        <Route path="/uploaded" element={<UploadSuccess />} />
        <Route path="/files" element={<Files />} />
        <Route path="/analytics" element={<Analytics />} />

      </Route>

    </Routes>

  );

}