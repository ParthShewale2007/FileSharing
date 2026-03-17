// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";

// export default function SignIn() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {

//     if (!email || !password) {
//       alert("Enter email and password");
//       return;
//     }

//     setLoading(true);

//     try {

//       const res = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           email,
//           password
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.error || "Login failed");
//         setLoading(false);
//         return;
//       }

//       /* Save JWT token */

//       localStorage.setItem("token", data.token);

//       /* Redirect */

//       navigate("/upload");

//     } catch (err) {

//       console.log(err);
//       alert("Server error");

//     }

//     setLoading(false);

//   };

//   //-----------------New Variable----------------------
//   const handleGoogleLogin = async (credentialResponse) => {
//     try {
//       const res = await fetch("http://localhost:5000/api/google-login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token: credentialResponse.credential,
//         }),
//       });

//       const text = await res.json();
//       console.log("RAW RESPONSE: ", text);

//       let data;
//       try {
//         data = JSON.parse(text);
//       } catch {
//         console.error("Not JSON response");
//         return;
//       }

//       // localStorage.setItem("token", data.token);
//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         navigate("/upload");
//       } else {
//         alert("Google login failed");
//       }

//       navigate("/upload");
//     } catch (err) {
//       console.log(err);
//       alert("Google login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT SIDE IMAGE */}

//       <div className="w-1/2 relative">
//         <img
//           src="https://images.unsplash.com/photo-1557683316-973673baf926"
//           alt="Background"
//           className="absolute inset-0 w-full h-full object-cover"
//         />

//         <div className="absolute inset-0 bg-black/40" />

//         <div className="relative z-10 p-14 text-white">
//           <h1 className="text-3xl font-semibold">Welcome to FileFlux 🚀</h1>

//           <p className="mt-4 text-sm max-w-sm opacity-80">
//             Securely upload and share files.
//           </p>
//         </div>
//       </div>

//       {/* RIGHT SIDE LOGIN */}

//       <div className="w-1/2 flex items-center justify-center">
//         <div className="w-[420px] bg-white p-8 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-6">Sign in</h2>

//           {/* Email */}

//           <input
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full mb-4 px-4 py-2 border rounded-md"
//           />

//           {/* Password */}

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full mb-6 px-4 py-2 border rounded-md"
//           />

//           {/* Login Button */}

//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>

//           {/* Google Login */}
//           <div className="mt-4 flex justify-center">
//             <GoogleLogin
//               onSuccess={handleGoogleLogin}
//               onError={() => console.log("Login Failed")}
//             />
//           </div>

//           {/* Signup */}

//           <p className="text-sm text-center mt-6 text-gray-500">
//             Don't have an account?{" "}
//             <span
//               onClick={() => navigate("/signup")}
//               className="text-blue-600 cursor-pointer"
//             >
//               Sign up
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );

// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- NORMAL LOGIN ---------------- */

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        setLoading(false);
        return;
      }

      /* 🔥 IMPORTANT FIX */
      localStorage.removeItem("token");
      localStorage.setItem("token", data.token);

      /* 🔥 FORCE REFRESH */
      window.location.href = "/upload";

    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin = async (credentialResponse) => {
    try {

      const res = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential,
        }),
      });

      const data = await res.json();
      console.log("GOOGLE RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      if (data.token) {

        /* 🔥 IMPORTANT FIX */
        localStorage.removeItem("token");
        localStorage.setItem("token", data.token);

        /* 🔥 FORCE REFRESH */
        window.location.href = "/upload";

      } else {
        alert("Google login failed");
      }

    } catch (err) {
      console.log(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 p-14 text-white">
          <h1 className="text-3xl font-semibold">Welcome to FileFlux 🚀</h1>
          <p className="mt-4 text-sm max-w-sm opacity-80">
            Securely upload and share files.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[420px] bg-white p-8 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-6">Sign in</h2>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border rounded-md"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border rounded-md"
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />
          </div>

          {/* Signup */}
          <p className="text-sm text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}