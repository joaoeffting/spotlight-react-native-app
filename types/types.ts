import { Doc, Id } from "@/convex/_generated/dataModel";

export type PostsWithInfo = Doc<"posts"> & {
  author: {
    _id: Id<"users"> | undefined;
    username: string | undefined;
    fullname: string | undefined;
    image: string | undefined;
  };
  isLiked: boolean;
  isBookmarked: boolean;
};

export type CommentsWithInfo = Doc<"comments"> & {
  user: {
    _id: Id<"users">;
    _creationTime: number;
    bio?: string | undefined;
    username: string;
    fullname: string;
    email: string;
    image: string;
    followers: number;
    following: number;
    posts: number;
    clerkId: string;
  } | null;
};
