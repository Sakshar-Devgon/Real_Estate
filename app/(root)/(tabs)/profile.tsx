import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert("Error", "Failed to update profile picture. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Header */}
        <View className="bg-white px-5 pt-6 pb-8 items-center border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900 self-start mb-6">Profile</Text>

          {/* Avatar */}
          <View className="relative mb-4">
            <Image
              source={{ uri: user.imageUrl }}
              style={{ width: 88, height: 88, borderRadius: 44 }}
            />
            <TouchableOpacity
              onPress={handleUpdateProfileImage}
              disabled={isUpdating}
              className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full items-center justify-center border-2 border-white"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="camera" size={13} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-sm text-gray-400 mt-1">
            {user.emailAddresses[0].emailAddress}
          </Text>
        </View>

        {/* Menu */}
        <View className="px-5 mt-6 gap-3">

          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-1">
            Account
          </Text>

          <View className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <MenuItem
              icon="heart"
              iconBg="#FEE2E2"
              iconColor="#EF4444"
              label="Saved Properties"
              onPress={() => router.push("/(root)/(tabs)/saved")}
            />
            <Divider />
            <MenuItem
              icon="notifications"
              iconBg="#EFF6FF"
              iconColor="#2563EB"
              label="Notifications"
              onPress={() => Alert.alert("Coming Soon", "Notifications coming soon!")}
            />
          </View>

          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1 px-1">
            General
          </Text>

          <View className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <MenuItem
              icon="settings"
              iconBg="#F3F4F6"
              iconColor="#6B7280"
              label="Settings"
              onPress={() => Alert.alert("Coming Soon", "Settings coming soon!")}
            />
            <Divider />
            <MenuItem
              icon="help-circle"
              iconBg="#F0FDF4"
              iconColor="#16A34A"
              label="Help & Support"
              onPress={() =>
                Linking.openURL(
                  "mailto:sakshardevgon98@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App"
                )
              }
            />
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            onPress={handleSignOut}
            className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function Divider() {
  return <View className="h-px bg-gray-100 ml-16" />;
}

function MenuItem({
  icon,
  iconBg,
  iconColor,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-3 px-4 py-3.5"
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="flex-1 text-gray-800 font-medium text-sm">{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
