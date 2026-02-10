"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentSection from "../../components/CommentSection";
import Image from "next/image";

export default function SinglePost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, [slug]);

  if (!post)
    return <div className="text-center mt-10 text-white">Loading...</div>;

  return error ? (
    <div className="text-center mt-10 text-white">Blog not found</div>
  ) : (
    <div className="max-w-3xl mx-auto mt-6 mb-20">
      {post?.image && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-contain"
            width={200}
            height={200}
          />
        </div>
      )}
      <div className="card mb-8">
        <h1 className="text-4xl font-bold text-blue-400 mb-4">{post?.title}</h1>
        <div className="flex justify-between text-gray-400 text-sm mb-6 border-b border-gray-700 pb-2">
          <span>By {post?.author?.name}</span>
          <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post?.content}
        </div>
      </div>
      <CommentSection postId={post?._id} postAuthorId={post?.author?._id} />
    </div>
  );
}
