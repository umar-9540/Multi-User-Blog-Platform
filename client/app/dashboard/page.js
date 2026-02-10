"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import AdminView from "../components/AdminView";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", "Published");
    if (file) {
      formData.append("image", file);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Post published!");
      router.push("/");
    } else {
      alert("Failed to publish");
    }
    setLoading(false);
  };

  if (!user) return <p>Please login.</p>;

  if (user.role === "ADMIN") {
    return <AdminView />;
  }

  return (
    <div className="max-w-2xl mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-6 text-white">Create New Post</h1>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Blog Image</label>
          <input
            type="file"
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Content</label>
          <textarea
            className="input h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button disabled={loading} className="btn w-full">
          {loading ? "Uploading..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
