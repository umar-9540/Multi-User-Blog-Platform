"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post._id} className="card">
            <h2 className="text-2xl font-bold text-blue-400">
              <Link href={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-400 text-sm mb-2">
              By {post.author.name} •{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-4">
              {post.content.substring(0, 150)}...
            </p>
            <Link
              href={`/post/${post.slug}`}
              className="text-blue-400 hover:underline"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
