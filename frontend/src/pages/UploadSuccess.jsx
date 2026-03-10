// import { useLocation } from "react-router-dom";
// import { useState } from "react";

// export default function UploadSuccess() {

//   const { state } = useLocation();

//   const [email, setEmail] = useState("");
//   const [passwordEnabled, setPasswordEnabled] = useState(false);
//   const [password, setPassword] = useState("");

//   if (!state) return <p>No file data</p>;

//   const { name, size, type, url, fileId } = state;

//   const fileLink = `http://localhost:5173/download/${fileId}`;

//   const copyLink = () => {
//     navigator.clipboard.writeText(fileLink);
//     alert("Link copied!");
//   };

//   const savePassword = async () => {

//     if (!passwordEnabled) return;

//     await fetch(`http://localhost:5000/api/set-password/${fileId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ password })
//     });

//     alert("Password saved!");

//   };

//   const isImage = type?.startsWith("image");

//   const sendEmail = async () => {

//   const res = await fetch("http://localhost:5000/api/send-email", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email,
//       fileId
//     })
//   });

//   const data = await res.json();

//   alert(data.message);
// };

//   return (

//     <div className="flex gap-10">

//       {/* FILE PREVIEW */}

//       <div className="bg-white border rounded-xl p-8 w-[400px] text-center">

//         {isImage && (
//           <img
//             src={url}
//             alt="preview"
//             className="w-56 mx-auto mb-4 rounded"
//           />
//         )}

//         <p className="font-medium">{name}</p>

//         <p className="text-sm text-gray-500">
//           {type} / {(size / 1024).toFixed(0)} KB
//         </p>

//       </div>

//       {/* SHARE PANEL */}

//       <div className="bg-white border rounded-xl p-8 w-[400px]">

//         <p className="text-sm text-gray-500 mb-2">
//           Download Link
//         </p>

//         <div className="flex gap-2 mb-6">

//           <input
//             value={fileLink}
//             readOnly
//             className="flex-1 border px-3 py-2 rounded"
//           />

//           <button
//             onClick={copyLink}
//             className="bg-gray-200 px-3 rounded"
//           >
//             📋
//           </button>

//         </div>

//         {/* PASSWORD */}

//         <div className="flex items-center gap-2 mb-4">

//           <input
//             type="checkbox"
//             checked={passwordEnabled}
//             onChange={() =>
//               setPasswordEnabled(!passwordEnabled)
//             }
//           />

//           <label>Enable Password?</label>

//         </div>

//         {passwordEnabled && (

//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) =>
//               setPassword(e.target.value)
//             }
//             className="border px-3 py-2 rounded w-full mb-4"
//           />

//         )}

//         <button
//           onClick={savePassword}
//           className="w-full bg-blue-600 text-white py-2 rounded"
//         >
//           Save Password
//         </button>

//         {/* EMAIL */}

//         <p className="text-sm text-gray-500 mt-6 mb-2">
//           Send File to Email
//         </p>

//         <input
//           type="email"
//           placeholder="example@gmail.com"
//           value={email}
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//           className="border px-3 py-2 rounded w-full mb-4"
//         />

//         <button
//           className="w-full bg-blue-600 text-white py-2 rounded"
//           onClick={sendEmail}
//         >
//           Send Email
//         </button>

//       </div>

//     </div>
//   );
// }

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UploadSuccess() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) return <p>No file data</p>;

  const { name, size, type, url, fileId } = state;

  const fileLink = `http://localhost:5173/download/${fileId}`;

  /* Copy Link */

  const copyLink = () => {
    navigator.clipboard.writeText(fileLink);
    alert("Link copied!");
  };

  /* Save Password */

  const savePassword = async () => {

    if (!passwordEnabled || !password) return;

    await fetch(`http://localhost:5000/api/set-password/${fileId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    alert("Password saved!");
  };

  /* Send Email */

  const sendEmail = async () => {

    if (!email) {
      alert("Please enter email");
      return;
    }

    try {

      setLoading(true);

      await fetch("http://localhost:5000/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          fileId
        })
      });

      alert("Email sent successfully!");

      /* Redirect to upload page */

      navigate("/upload");

    } catch (err) {

      alert("Failed to send email");

    } finally {

      setLoading(false);

    }

  };

  const isImage = type?.startsWith("image");

  return (

    <div className="flex gap-10 p-10">

      {/* FILE PREVIEW */}

      <div className="bg-white border rounded-xl p-8 w-[400px] text-center">

        {isImage && (
          <img
            src={url}
            alt="preview"
            className="w-56 mx-auto mb-4 rounded"
          />
        )}

        <p className="font-medium">{name}</p>

        <p className="text-sm text-gray-500">
          {(size / 1024).toFixed(1)} KB
        </p>

      </div>

      {/* SHARE PANEL */}

      <div className="bg-white border rounded-xl p-8 w-[400px]">

        <p className="text-sm text-gray-500 mb-2">
          Download Link
        </p>

        <div className="flex gap-2 mb-6">

          <input
            value={fileLink}
            readOnly
            className="flex-1 border px-3 py-2 rounded"
          />

          <button
            onClick={copyLink}
            className="bg-gray-200 px-3 rounded"
          >
            📋
          </button>

        </div>

        {/* PASSWORD */}

        <div className="flex items-center gap-2 mb-4">

          <input
            type="checkbox"
            checked={passwordEnabled}
            onChange={() =>
              setPasswordEnabled(!passwordEnabled)
            }
          />

          <label>Enable Password?</label>

        </div>

        {passwordEnabled && (

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border px-3 py-2 rounded w-full mb-4"
          />

        )}

        <button
          onClick={savePassword}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Save Password
        </button>

        {/* EMAIL */}

        <p className="text-sm text-gray-500 mt-6 mb-2">
          Send File to Email
        </p>

        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="border px-3 py-2 rounded w-full mb-4"
        />

        <button
          onClick={sendEmail}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>

      </div>

    </div>

  );

}