import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      alert("Account created successfully ✅");

      navigate("/signin");

    } catch (err) {
      console.log(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 p-14 text-white">
          <h1 className="text-3xl font-semibold">
            Create your FileFlux account 🚀
          </h1>
          <p className="mt-4 text-sm max-w-sm opacity-80">
            Start uploading and sharing files securely.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[420px] bg-white p-8 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-6">Sign up</h2>

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

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          {/* Sign in link */}
          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-blue-600 cursor-pointer"
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}