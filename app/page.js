"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("data", data);

      if (data.url) {
        setFileUrl(data.url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gray-900">
      <main className="w-full max-w-md sm:max-w-lg bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg flex flex-col gap-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-center text-gray-200 font-semibold">
          S3 File Uploader
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0])}
            className="p-3 sm:p-4 bg-gray-200 text-black border-2 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-300 cursor-pointer transition"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 sm:p-4 bg-blue-500 text-white rounded-lg font-medium text-sm sm:text-base hover:bg-blue-600 cursor-pointer transition disabled:opacity-50"
          >
            {isLoading ? "Uploading..." : "Upload your file"}
          </button>
        </form>

        {fileUrl && (
          <div className="mt-3 sm:mt-4 text-center break-words">
            <p className="text-green-400 mb-2 text-xs sm:text-sm md:text-base">
              Uploaded successfully!
            </p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline text-xs sm:text-sm md:text-base"
            >
              {fileUrl}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
