import { useNavigate } from "react-router-dom";
import logo from "../assets/Fileflux1.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-16 py-6">
        
        <img src={logo} alt="FileFlux Logo" className="h-10 object-contain" />
        <button
          onClick={() => navigate("/signin")}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          Get Started
        </button>
        
      </div>

      <div className="flex flex-col items-center text-center mt-28 px-4">
        <h1 className="text-[52px] leading-[1.15] font-bold max-w-4xl">
          <span className="text-blue-600">Upload</span>, Save and easily
          <br />
          <span className="text-blue-600">Share</span> your files in one place
        </h1>

        <p className="mt-6 text-gray-500 max-w-xl">
          and share it with your friends securely.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            Drag
            and
            drop
            your
            file
            directly
            on
            our
            cloud
            onClick={() => navigate("/signin")}
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-sm font-medium"
          >
            Get Started
          </button>

          <button className="border border-gray-300 px-8 py-3 rounded-md text-sm font-medium">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
