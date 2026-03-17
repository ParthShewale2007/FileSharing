import { useEffect, useState } from "react";

function Files() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/files", 
      {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)){
          setHistory(data);
        } else {
          setHistory([]);
        }
      })
      .catch((err) => console.log(err));

  }, []);

  const deleteFile = async (id) => {

  const token = localStorage.getItem("token"); // 🔥 ADD THIS

  try {

    const res = await fetch(`http://localhost:5000/api/files/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}` // 🔥 ADD THIS
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Delete failed");
      return;
    }

    // ✅ Update UI only after success
    setHistory((prev) => prev.filter((file) => file._id !== id));

  } catch (err) {
    console.log(err);
  }

};

  return (

    // <div className="p-6">

    //   <h1 className="text-2xl font-semibold mb-6">
    //     Upload History
    //   </h1>

    //   <table className="w-full border border-gray-300">

    //     <thead className="bg-gray-200">

    //       <tr>
    //         <th className="p-3 border">File Name</th>
    //         <th className="p-3 border">Type</th>
    //         <th className="p-3 border">Size</th>
    //         <th className="p-3 border">Date</th>
    //         <th className="p-3 border">Download</th>
    //         <th className="p-3 border">Delete</th>
    //       </tr>

    //     </thead>

    //     <tbody>

    //       {history.length === 0 && (
    //         <tr>
    //           <td colSpan="6" className="p-6 text-center text-gray-500">
    //             No files found
    //           </td>
    //         </tr>
    //       )}

    //       {history.map((file) => {

    //         const fileType = file?.filename
    //           ? file.filename.split(".").pop()
    //           : "Unknown";

    //         const sizeMB = file?.size
    //           ? (file.size / 1024 / 1024).toFixed(2)
    //           : "0";

    //         const uploadDate = file?.uploadDate
    //           ? new Date(file.uploadDate).toLocaleString()
    //           : "-";

    //         return (

    //           <tr key={file._id} className="text-center border-b">

    //             <td className="p-3 border">
    //               {file?.originalname || "Unknown"}
    //             </td>

    //             <td className="p-3 border">
    //               {fileType}
    //             </td>

    //             <td className="p-3 border">
    //               {sizeMB} MB
    //             </td>

    //             <td className="p-3 border">
    //               {uploadDate}
    //             </td>

    //             <td className="p-3 border">

    //               {file?.filename && (

    //                 <a
    //                   href={`http://localhost:5000/api/download-zip/${file.groupId}?verified=true`}
    //                   download
    //                   className="bg-blue-500 text-white px-3 py-1 rounded"
    //                 >
    //                   Download
    //                 </a>

    //               )}

    //             </td>

    //             <td className="p-3 border">

    //               <button
    //                 onClick={() => deleteFile(file._id)}
    //                 className="bg-red-500 text-white px-3 py-1 rounded"
    //               >
    //                 Delete
    //               </button>

    //             </td>

    //           </tr>

    //         );

    //       })}

    //     </tbody>

    //   </table>

    // </div>
    <div className="min-h-screen bg-gray-100 p-8">

  <h1 className="text-2xl font-semibold mb-6">Upload History</h1>

  <div className="bg-white rounded-xl shadow overflow-hidden">

    <table className="w-full">

      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="p-4">File</th>
          <th className="p-4">Type</th>
          <th className="p-4">Size</th>
          <th className="p-4">Date</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>

      <tbody>

        {history.length === 0 && (
          <tr>
            <td colSpan="5" className="text-center p-6 text-gray-500">
              No files uploaded yet
            </td>
          </tr>
        )}

        {history.map((file) => {

          const fileType = file.filename?.split(".").pop();
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          const date = new Date(file.uploadDate).toLocaleString();

          return (

            <tr key={file._id} className="border-b hover:bg-gray-50">

              <td className="p-4 font-medium">
                {file.originalname}
              </td>

              <td className="p-4 text-gray-500">{fileType}</td>

              <td className="p-4">{sizeMB} MB</td>

              <td className="p-4 text-sm text-gray-500">{date}</td>

              <td className="p-4 flex gap-3 justify-center">

                <a
                  href={`http://localhost:5000/api/download-zip/${file.groupId}?verified=true`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Download
                </a>

                <button
                  onClick={() => deleteFile(file._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>

              </td>

            </tr>

          );

        })}

      </tbody>

    </table>

  </div>

</div>
  );

}

export default Files;