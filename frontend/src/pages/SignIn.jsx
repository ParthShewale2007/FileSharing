import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 p-14 text-white">
          <h1 className="text-3xl font-semibold">
            Welcome to FileFlux 🚀
          </h1>
          <p className="mt-4 text-sm max-w-sm opacity-80">
            Securely upload and share files.
          </p>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div className="w-420px bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-6">Sign in</h2>

          <input
            placeholder="Email address"
            className="w-full mb-6 px-4 py-2 border rounded-md"
          />

          <button
            onClick={() => navigate("/upload")}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md text-sm font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
