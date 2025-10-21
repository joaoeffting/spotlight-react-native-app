import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/create.styles";

export default function Create() {
  const router = useRouter();
  const { user } = useUser();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.createPost);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  if (!image) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <View style={{ width: 28 }} />
        </View>

        <TouchableOpacity
          style={styles.emptyImageContainer}
          onPress={pickImage}
        >
          <Ionicons name="image" size={48} color={COLORS.grey} />
          <Text style={styles.emptyImageText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShare = async () => {
    if (!image) return;

    try {
      setUploading(true);
      const uploadUrl = await generateUploadUrl();

      // First, fetch the image file from local URI
      const imageResponse = await fetch(image);
      const blob = await imageResponse.blob();

      // Upload the raw blob directly
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: blob,
        headers: {
          "Content-Type": "image/jpeg", // or get the actual mime type
          "Content-Length": blob.size.toString(),
        },
      });

      if (!uploadResponse.ok) throw new Error("Upload failed");

      const responseData = await uploadResponse.json();
      const { storageId } = responseData;

      await createPost({ storageId, caption });
      setImage(null);
      setCaption("");
      router.push("/(tabs)");
    } catch (error) {
      console.log("Error sharing post", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {/* HEADER */}
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setImage(null);
              setCaption("");
            }}
            disabled={uploading}
          >
            <Ionicons
              name="close-outline"
              size={28}
              color={uploading ? COLORS.grey : COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Post</Text>
          <TouchableOpacity
            style={[
              styles.shareButton,
              uploading && styles.shareButtonDisabled,
            ]}
            disabled={uploading || !image}
            onPress={handleShare}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : (
              <Text style={styles.shareText}>Share</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentOffset={{ x: 0, y: 100 }}
      >
        {/* IMAGE SECTION */}
        <View style={[styles.content, uploading && styles.contentDisabled]}>
          <View style={styles.imageSection}>
            <Image
              source={image}
              style={styles.previewImage}
              contentFit="cover"
              transition={200}
            />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={pickImage}
              disabled={uploading}
            >
              <Ionicons name="image-outline" size={20} color={COLORS.white} />
              <Text style={styles.changeImageText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CAPTION SECTION */}
        <View style={styles.inputSection}>
          <View style={styles.captionContainer}>
            <Image
              source={user?.imageUrl}
              style={styles.userAvatar}
              contentFit="cover"
              transition={200}
            />
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor={COLORS.grey}
              multiline
              value={caption}
              onChangeText={setCaption}
              editable={!uploading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
