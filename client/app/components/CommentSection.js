"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({ postId, postAuthorId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      },
    );

    if (res.ok) {
      const savedComment = await res.json();
      setComments([
        { ...savedComment, user: { name: user.name, _id: user._id } },
        ...comments,
      ]);
      setNewComment("");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (res.ok) {
      setComments(comments.filter((c) => c._id !== commentId));
    }
  };

  return (
    <div className="mt-10 border-t border-slate-700 pt-6">
      <h3 className="text-xl font-bold mb-4 text-blue-400">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            rows="1"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button className="btn mt-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-400 italic">
          Please{" "}
          <a href="/login" className="text-blue-400 underline">
            login
          </a>{" "}
          to comment.
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => {
            // Permission Logic: Who can delete?
            const isOwner = user && user._id === comment.user._id;
            const isPostAuthor = user && user._id === postAuthorId;
            const isAdmin = user && user.role === "ADMIN";
            const canDelete = isOwner || isPostAuthor || isAdmin;

            return (
              <div
                key={comment._id}
                className="p-4 bg-slate-800 rounded-lg border border-slate-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center w-full justify-between">
                    <h4 className="font-bold text-slate-200">
                      {comment.user.name}
                    </h4>
                    <span className="text-xs text-slate-500 pr-10">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-2 text-slate-300">{comment.content}</p>
              </div>
            );
          })
        )}
        {comments.length === 0 && !loading && (
          <p className="text-gray-500">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
