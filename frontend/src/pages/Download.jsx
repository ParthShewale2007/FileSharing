// import { useParams } from "react-router-dom";
// import logo from "../assets/Fileflux1.png";

// export default function Download() {

//   const { id } = useParams();

//   const downloadFile = () => {
//     window.location.href = `http://localhost:5000/api/download/${id}`;
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">

//       <div className="bg-white p-8 rounded-xl border text-center w-80">

//         {/* Logo */}
//         <div className="px-8 py-6 flex items-center justify-center">
//           <img
//             src={logo}
//             alt="FileFlux Logo"
//             className="h-10 object-contain"
//           />
//         </div>

//         {/* Info text */}
//         <p className="text-sm text-gray-500 mb-2">
//           Someone shared a file with you
//         </p>

//         {/* Icon */}
//         <p className="text-4xl mb-4">
//           📄
//         </p>

//         {/* Download Button */}
//         <button
//           onClick={downloadFile}
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           Download File
//         </button>

//       </div>

//     </div>
//   );
// }

import { useParams } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/Fileflux1.png";

export default function Download() {

  const { id } = useParams();

  const [password, setPassword] = useState("");

  const verifyPassword = async () => {

    const res = await fetch(`http://localhost:5000/api/verify-password/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      window.location.href = `http://localhost:5000/api/download/${id}`;
    } else {
      alert("Wrong password");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl border text-center w-80">

        <img
          src={logo}
          alt="FileFlux Logo"
          className="h-10 mx-auto mb-4"
        />

        <p className="text-sm text-gray-500 mb-4">
          Enter password to download file
        </p>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-2 rounded mb-4 w-full"
        />

        <button
          onClick={verifyPassword}
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Download File
        </button>

      </div>

    </div>
  );
}