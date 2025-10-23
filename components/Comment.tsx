import { styles } from "@/styles/feed.styles";
import { CommentsWithInfo } from "@/types/types";
import { formatDistanceToNow } from "date-fns";
import { Image, Text, View } from "react-native";

export default function Comment({ comment }: { comment: CommentsWithInfo }) {
  return (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user?.image }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.user?.fullname}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
