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
