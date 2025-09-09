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
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl text-gray-300 font-semibold my-3">
          S3 file uploader
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="p-5 bg-gray-300 text-black border-2 rounded-full font-serif text-xl hover:bg-gray-500 cursor-pointer transition 100"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="p-5 bg-blue-300 text-black border-2 rounded-full font-serif text-xl hover:bg-blue-500 cursor-pointer transition 100 disabled:opacity-50"
            >
              {isLoading ? "Uploading..." : "Upload your file"}
            </button>
          </div>
        </form>

        {fileUrl && (
          <div className="mt-5">
            <p className="text-green-400">Uploaded successfully!</p>
            <a
              href={fileUrl}
              target="_blank"
              className="text-blue-400 underline"
            >
              {fileUrl}
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
