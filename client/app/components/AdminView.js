"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminView() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch Users
    fetch("http://localhost:5000/api/auth/users", { headers })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    // Fetch Posts
    fetch("http://localhost:5000/api/posts/admin", { headers })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleDeletePost = async (id) => {
    if (!confirm("Delete this post permanently?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(posts.filter((p) => p._id !== id));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-white">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-2 px-4 ${activeTab === "posts" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
        >
          Manage Posts
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 px-4 ${activeTab === "users" ? "border-b-2 border-blue-500 text-blue-400" : "text-gray-400"}`}
        >
          Manage Users
        </button>
      </div>

      {/* Posts Table */}
      {activeTab === "posts" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-b border-gray-700 hover:bg-slate-800"
                >
                  <td className="px-6 py-4 font-medium">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    {post.author?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${post.status === "Published" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-800 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-gray-700 hover:bg-slate-800"
                >
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 text-xs font-bold text-blue-300">
                    {u.role}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
