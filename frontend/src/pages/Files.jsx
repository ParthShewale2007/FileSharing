// import { useEffect, useState } from "react";

// export default function Files() {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const stored =
//       JSON.parse(localStorage.getItem("uploadHistory")) || [];
//     setHistory(stored);
//   }, []);

//   return (
//     <>
//       <h1 className="text-2xl font-semibold mb-1">
//         Upload History
//       </h1>

//       <p className="text-gray-500 mb-8">
//         Total Files: {history.length}
//       </p>

//       {history.length === 0 ? (
//         <p className="text-gray-500">
//           No uploads yet.
//         </p>
//       ) : (
//         <div className="bg-white rounded-xl border overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-4 text-left">File</th>
//                 <th>Type</th>
//                 <th>Size</th>
//                 <th>Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {history.map((file, i) => (
//                 <tr key={i} className="border-b">
//                   <td className="px-6 py-4 font-medium">
//                     {file.name}
//                   </td>
//                   <td>{file.type}</td>
//                   <td>{file.size}</td>
//                   <td>{file.date}</td>
//                   <td className="text-green-600 font-medium">
//                     {file.status}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </>
//   );
// }
import { useEffect, useState } from "react";

function Files() {

  const [history, setHistory] = useState([]);

  /* Fetch files from backend */
  useEffect(() => {
    fetch("http://localhost:5000/api/files")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.log(err));
  }, []);

  /* Delete file */
  const deleteFile = async (id) => {
    try {

      await fetch(`http://localhost:5000/api/files/${id}`, {
        method: "DELETE",
      });

      setHistory(history.filter((file) => file._id !== id));

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Upload History
      </h1>

      <table className="w-full border border-gray-300">

        <thead className="bg-gray-200">

          <tr>

            <th className="p-3 border">File Name</th>
            <th className="p-3 border">Type</th>
            <th className="p-3 border">Size</th>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Download</th>
            <th className="p-3 border">Delete</th>

          </tr>

        </thead>

        <tbody>

          {history.map((file) => (

            <tr key={file._id} className="text-center border-b">

              <td className="p-3 border">
                {file.originalname}
              </td>

              <td className="p-3 border">
                {file.filename.split(".").pop()}
              </td>

              <td className="p-3 border">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </td>

              <td className="p-3 border">
                {new Date(file.uploadDate).toLocaleString()}
              </td>

              <td className="p-3 border">

                <a
                  href={`http://localhost:5000/uploads/${file.filename}`}
                  download
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Download
                </a>

              </td>

              <td className="p-3 border">

                <button
                  onClick={() => deleteFile(file._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default Files;