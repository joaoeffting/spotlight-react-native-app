import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Comment from "./Comment";
import Loader from "./Loader";

function CommentsModal({
  visible,
  onClose,
  postId,
}: {
  visible: boolean;
  onClose: () => void;
  postId: Id<"posts">;
}) {
  const [comment, setComment] = useState<string>("");
  const commentsQuery = useQuery(api.comments.getComments, { postId });
  const addCommentMutation = useMutation(api.comments.addComment);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addCommentMutation({ postId, content: comment });
      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Comments</Text>
          <View style={{ width: 24 }} />
        </View>
        {commentsQuery === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={commentsQuery}
            renderItem={({ item }) => <Comment comment={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.commentsList}
          />
        )}
        <View style={styles.commentInput}>
          <TextInput
            placeholder="Add a comment"
            value={comment}
            onChangeText={setComment}
            onSubmitEditing={handleAddComment}
            style={styles.input}
            multiline={true}
          />
          <TouchableOpacity onPress={() => handleAddComment()}>
            <Ionicons name="send" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default CommentsModal;
