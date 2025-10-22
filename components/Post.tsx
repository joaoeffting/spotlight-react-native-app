import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { PostsWithInfo } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/feed.styles";

export default function Post({ post }: { post: PostsWithInfo }) {
  const [isLiking, setIsLiking] = useState(false);

  const likePostMutation = useMutation(api.posts.likePostMutation);

  const handleLike = async () => {
    try {
      setIsLiking(true);
      await likePostMutation({ postId: post._id });
    } catch (error) {
      console.error("Error liking post: ", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <View style={styles.post}>
      {/* header */}
      <View style={styles.postHeader}>
        <Link href={`/user/${post?.author?._id}`}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post?.author?.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post?.author?.username}</Text>
          </TouchableOpacity>
        </Link>
        {/* <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity> */}
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Text>{post.caption}</Text>
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* POST ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike} disabled={isLiking}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Ionicons
                name={post.isLiked ? "heart" : "heart-outline"}
                size={24}
                color={post.isLiked ? COLORS.primary : COLORS.white}
              />
              <Text style={styles.likesText}>{post.likes}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name={"bookmark-outline"} size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>Be the first one to like</Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author?.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.commentsText}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>2 days ago</Text>
      </View>
    </View>
  );
}
