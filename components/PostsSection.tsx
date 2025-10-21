import { PostsWithInfo } from "@/types/types";
import React from "react";
import Post from "./Post";

export default function PostsSection({ posts }: { posts: PostsWithInfo[] }) {
  return (
    <>
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </>
  );
}
