import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Upload from "./pages/Upload";
import UploadSuccess from "./pages/UploadSuccess";
import Files from "./pages/Files";
import Download from "./pages/Download";

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/download/:id" element={<Download />} />

      <Route element={<DashboardLayout />}>
        <Route path="/upload" element={<Upload />} />
        <Route path="/uploaded" element={<UploadSuccess />} />
        <Route path="/files" element={<Files />} />
      </Route>
    </Routes>
  );
}