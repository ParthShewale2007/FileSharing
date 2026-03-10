import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {

  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  /* Select Files */

  const handleFileChange = (e) => {

    const newFiles = Array.from(e.target.files);

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

  };

  /* Drag Drop */

  const handleDrop = (e) => {

    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);

    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);

  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /* Remove File */

  const removeFile = (index) => {

    const updated = [...files];

    updated.splice(index, 1);

    setFiles(updated);

  };

  /* Upload */

  const handleUpload = async () => {

    if (!files.length) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    const firstFile = files[0];

    navigate("/uploaded", {
      state: {
        name: firstFile.name,
        size: firstFile.size,
        type: firstFile.type,
        url: URL.createObjectURL(firstFile),
        fileId: data.fileId
      }
    });

  };

  return (

    <div className="p-10">

      <h2 className="text-2xl font-semibold mb-6">
        Upload Files
      </h2>

      {/* Drag Drop Box */}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="
        border-2 border-dashed border-gray-300
        rounded-xl
        p-12
        text-center
        bg-gray-50
        "
      >

        <p className="text-gray-500 mb-3">
          Drag & drop files here
        </p>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          id="fileInput"
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="
          bg-blue-600
          text-white
          px-5
          py-2
          rounded-md
          cursor-pointer
          "
        >
          Browse Files
        </label>

      </div>

      {/* Selected Files */}

      {files.length > 0 && (

        <div className="mt-6">

          <h3 className="font-semibold mb-3">
            Selected Files ({files.length})
          </h3>

          {files.map((file, index) => {

            const isImage = file.type.startsWith("image");

            return (

              <div
                key={index}
                className="
                flex
                items-center
                justify-between
                border
                p-3
                rounded-lg
                mb-3
                bg-white
                "
              >

                <div className="flex items-center gap-4">

                  {isImage ? (

                    <img
                      src={URL.createObjectURL(file)}
                      className="w-16 h-16 object-cover rounded"
                    />

                  ) : (

                    <span className="text-3xl">
                      📄
                    </span>

                  )}

                  <div>

                    <p className="font-medium">
                      {file.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="
                  text-red-500
                  font-bold
                  text-lg
                  "
                >
                  Remove
                </button>

              </div>

            );

          })}

        </div>

      )}

      {/* Upload Button */}

      {files.length > 0 && (

        <div className="flex justify-center mt-8">

          <button
            onClick={handleUpload}
            className="
            bg-blue-600
            text-white
            px-8
            py-3
            rounded-lg
            hover:bg-blue-700
            "
          >
            Upload
          </button>

        </div>

      )}

    </div>

  );

}
