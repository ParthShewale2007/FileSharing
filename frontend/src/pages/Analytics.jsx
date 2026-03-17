// import { useEffect, useState } from "react";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer
// } from "recharts";

// export default function Analytics() {

//   const [files, setFiles] = useState([]);

//   useEffect(() => {

//     const token = localStorage.getItem("token");

//     fetch("http://localhost:5000/api/analytics", {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {

//         if (Array.isArray(data)) {
//           setFiles(data);
//         } else {
//           setFiles([]);
//         }

//       })
//       .catch(err => console.log(err));

//   }, []);

//   const chartData = files.map(file => ({
//     name: file?.originalname || "Unknown",
//     downloads: file?.downloads || 0
//   }));

//   return (

//     <div className="min-h-screen bg-gray-50 p-10">

//       <div className="max-w-6xl mx-auto">

//         <h1 className="text-2xl font-semibold mb-6">
//           Download Analytics
//         </h1>

//         <div className="bg-white p-6 rounded-lg border mb-10">

//           <h2 className="font-semibold mb-4">
//             Downloads per File
//           </h2>

//           <ResponsiveContainer width="100%" height={300}>

//             <BarChart data={chartData}>

//               <CartesianGrid strokeDasharray="3 3" />

//               <XAxis dataKey="name" />

//               <YAxis />

//               <Tooltip />

//               <Bar dataKey="downloads" />

//             </BarChart>

//           </ResponsiveContainer>

//         </div>

//         {files.map(file => (

//           <div
//             key={file._id}
//             className="bg-white p-6 mb-6 rounded-lg border"
//           >

//             <h2 className="font-semibold text-lg mb-2">
//               {file?.originalname || "Unknown"}
//             </h2>

//             <p className="text-gray-500 mb-4">
//               Total Downloads: {file?.downloads || 0}
//             </p>

//             <div className="text-sm text-gray-600">

//               {file?.downloadHistory?.map((d, i) => (

//                 <p key={i}>
//                   Downloaded at{" "}
//                   {new Date(d.date).toLocaleString()}
//                 </p>

//               ))}

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>

//   );

// }

import { useEffect, useState } from "react";

export default function Analytics() {

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/analytics", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.log(err));

  }, []);

  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Files</p>
          <h2 className="text-2xl font-bold">{totalFiles}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Storage</p>
          <h2 className="text-2xl font-bold">
            {(totalSize / 1024 / 1024).toFixed(2)} MB
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Recent Upload</p>
          <h2 className="text-md font-semibold">
            {files[0]?.originalname || "No files"}
          </h2>
        </div>

      </div>

      {/* RECENT FILES */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        {files.length === 0 ? (
          <p className="text-gray-500">No uploads yet</p>
        ) : (
          files.slice(0, 5).map(file => (
            <div key={file._id} className="flex justify-between py-2 border-b">
              <span>{file.originalname}</span>
              <span className="text-gray-500 text-sm">
                {new Date(file.uploadDate).toLocaleString()}
              </span>
            </div>
          ))
        )}

      </div>

    </div>
  );
}