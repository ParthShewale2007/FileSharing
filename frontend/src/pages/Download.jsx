// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Download() {

//   const { id } = useParams();

//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [needsPassword, setNeedsPassword] = useState(false);

//   useEffect(() => {

//     fetch(`http://localhost:5000/api/public-files/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setFiles(data);

//         if (data[0]?.password) {
//           setNeedsPassword(true);
//         }
//       });

//   }, [id]);

//   /* DOWNLOAD WITHOUT PASSWORD */

//   const downloadFiles = () => {

//     window.location.href =
//       `http://localhost:5000/api/download-zip/${id}?verified=true`;

//   };

//   /* VERIFY PASSWORD + DOWNLOAD */

//   const downloadWithPassword = async () => {

//     const res = await fetch(
//       `http://localhost:5000/api/verify-password/${id}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ password })
//       }
//     );

//     const data = await res.json();

//     if (data.success) {

//       window.location.href =
//         `http://localhost:5000/api/download-zip/${id}?verified=true`;

//     } else {

//       alert("Wrong password");

//     }

//   };

//   /* PASSWORD SCREEN */

//   if (needsPassword) {

//     return (

//       <div className="flex justify-center items-center h-screen">

//         <div className="bg-white border rounded-xl p-10 w-[350px] text-center">

//           <h2 className="text-xl font-semibold mb-6">
//             This file is password protected
//           </h2>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border p-2 w-full rounded mb-4"
//           />

//           <button
//             onClick={downloadWithPassword}
//             className="bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             Download
//           </button>

//         </div>

//       </div>

//     );

//   }


// }

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function Download() {

//   const { id } = useParams();

//   const [files, setFiles] = useState([]);
//   const [password, setPassword] = useState("");
//   const [needsPassword, setNeedsPassword] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     fetch(`http://localhost:5000/api/public-files/${id}`)
//       .then((res) => res.json())
//       .then((data) => {

//         setFiles(data);

//         if (data[0]?.password) {
//           setNeedsPassword(true);
//         }

//         setLoading(false);

//       })
//       .catch(() => setLoading(false));

//   }, [id]);

//   /* DOWNLOAD */
//   const downloadFiles = () => {
//     window.location.href =
//       `http://localhost:5000/api/download-zip/${id}?verified=true`;
//   };

//   /* PASSWORD DOWNLOAD */
//   const downloadWithPassword = async () => {

//     const res = await fetch(
//       `http://localhost:5000/api/verify-password/${id}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization : `Bearer ${localStorage.getItem("token")}`
//         },
//         body: JSON.stringify({ password })
//       }
//     );

//     const data = await res.json();

//     if (data.success) {
//       downloadFiles();
//     } else {
//       alert("Wrong password");
//     }

//   };

//   /* LOADING */
//   if (loading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <p className="text-gray-500">Loading...</p>
//       </div>
//     );
//   }

//   /* PASSWORD SCREEN */
//   if (needsPassword) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-100">

//         <div className="bg-white p-10 rounded-xl shadow text-center w-[350px]">

//           <h2 className="text-xl font-semibold mb-6">
//             🔒 Password Protected
//           </h2>

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="border p-2 w-full rounded mb-4"
//           />

//           <button
//             onClick={downloadWithPassword}
//             className="bg-blue-600 text-white px-6 py-2 rounded"
//           >
//             Download
//           </button>

//         </div>

//       </div>
//     );
//   }

//   /* ✅ NORMAL DOWNLOAD SCREEN (THIS WAS MISSING) */

//   return (

//     <div className="flex justify-center items-center h-screen bg-gray-100">

//       <div className="bg-white p-10 rounded-xl shadow text-center w-[400px]">

//         <h1 className="text-2xl font-bold mb-4">
//           📁 Files Ready
//         </h1>

//         <p className="text-gray-600 mb-6">
//           {files.length} file(s) available for download
//         </p>

//         <button
//           onClick={downloadFiles}
//           className="bg-blue-600 text-white px-6 py-2 rounded"
//         >
//           Download Files
//         </button>

//       </div>

//     </div>

//   );

// }

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Download() {

  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch(`http://localhost:5000/api/public-files/${id}`)
      .then((res) => res.json())
      .then((data) => {

        // ✅ handle both array and object response (future safe)
        const fileList = Array.isArray(data) ? data : data.files || [];

        setFiles(fileList);

        // ✅ reliable password detection
        if (
          fileList.length > 0 &&
          fileList[0].password !== undefined &&
          fileList[0].password !== ""
        ) {
          setNeedsPassword(true);
        }

        setLoading(false);

      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

  }, [id]);

  /* DOWNLOAD */
  const downloadFiles = () => {
    window.location.href =
      `http://localhost:5000/api/download-zip/${id}?verified=true`;
  };

  /* PASSWORD DOWNLOAD */
  const downloadWithPassword = async () => {

    try {

      const res = await fetch(
        `http://localhost:5000/api/verify-password/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ fixed comma issue
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await res.json();

      if (data.success) {
        downloadFiles();
      } else {
        alert("Wrong password");
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }

  };

  /* LOADING */
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-500">Loading files...</p>
      </div>
    );
  }

  /* PASSWORD SCREEN */
  if (needsPassword) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">

        <div className="bg-white p-10 rounded-xl shadow text-center w-[350px]">

          <h2 className="text-xl font-semibold mb-6">
            🔒 Password Protected
          </h2>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded mb-4"
          />

          <button
            onClick={downloadWithPassword}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
          >
            Download
          </button>

        </div>

      </div>
    );
  }

  /* NORMAL DOWNLOAD SCREEN */

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow text-center w-[400px]">

        <h1 className="text-2xl font-bold mb-4">
          📁 Files Ready
        </h1>

        <p className="text-gray-600 mb-4">
          {files.length} file(s) available
        </p>

        {/* OPTIONAL: show file names */}
        <div className="text-sm text-gray-500 mb-6 max-h-32 overflow-y-auto">
          {files.map((file) => (
            <div key={file._id}>{file.originalname}</div>
          ))}
        </div>

        <button
          onClick={downloadFiles}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
        >
          Download Files
        </button>

      </div>

    </div>

  );

}