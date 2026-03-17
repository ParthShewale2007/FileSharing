import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UploadSuccess() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!state) return <p>No data</p>;

  const { files, groupId } = state;

  const fileLink = `http://localhost:5173/download/${groupId}`;

  /* Copy link */

  const copyLink = () => {
    navigator.clipboard.writeText(fileLink);
    alert("Link copied!");
  };

  /* Save password */

  // const savePassword = async () => {

  //   if (!passwordEnabled || !password) {
  //     alert("Enter password first");
  //     return;
  //   }

  //   await fetch(`http://localhost:5000/api/set-password/${groupId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ password })
  //   });

  //   alert("Password saved!");
  // };
  const savePassword = async () => {

  if (!passwordEnabled || !password) {
    alert("Enter password first");
    return;
  }

  try {

    const res = await fetch(
      `http://localhost:5000/api/set-password/${groupId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` // ✅ FIX
        },
        body: JSON.stringify({ password })
      }
    );

    const data = await res.json();

    if (res.status === 403) {
      alert("Not authorized to set password");
      return;
    }

    alert("Password saved successfully! 🔒");

  } catch (err) {
    console.log(err);
    alert("Failed to save password");
  }

};

  /* Send email */

  const sendEmail = async () => {

    if (!email) {
      alert("Enter email");
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
          groupId
        })
      });

      alert("Email sent!");

      navigate("/upload");

    } catch {

      alert("Email failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-10">

      <button
        onClick={() =>
          navigate("/upload", { state: { files } })
        }
        className="mb-6 border px-5 py-2 rounded"
      >
        ← Go to Upload
      </button>

      <h2 className="text-xl font-semibold mb-6">
        Uploaded Files
      </h2>

      <div className="grid gap-4 mb-8">

        {files.map((file, index) => {

          const isImage = file.type?.startsWith("image");

          return (

            <div key={index} className="border p-4 rounded bg-white">

              {isImage && (
                <img
                  src={URL.createObjectURL(file)}
                  className="w-32 mb-2"
                />
              )}

              <p className="font-medium">{file.name}</p>

              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>

            </div>

          );

        })}

      </div>

      {/* Download Link */}

      <p className="text-sm text-gray-500 mb-2">
        Download Link
      </p>

      <div className="flex gap-2 mb-6">

        <input
          value={fileLink}
          readOnly
          className="border px-3 py-2 rounded flex-1"
        />

        <button
          onClick={copyLink}
          className="bg-gray-200 px-3 rounded"
        >
          📋
        </button>

      </div>

      {/* PASSWORD */}

      <div className="flex items-center gap-2 mb-3">

        <input
          type="checkbox"
          checked={passwordEnabled}
          onChange={() => setPasswordEnabled(!passwordEnabled)}
        />

        <label>Enable Password</label>

      </div>

      {passwordEnabled && (

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-4"
        />

      )}

      <button
        onClick={savePassword}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-6"
      >
        Save Password
      </button>

      {/* EMAIL */}

      <input
        type="email"
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      <button
        onClick={sendEmail}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Sending..." : "Send Email"}
      </button>

    </div>

  );

}
