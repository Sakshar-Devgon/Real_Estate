import { useSavedProperty } from "@/Hooks/useSavedProperty";
import { formatPrice } from "../lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    property.id,
    onUnsave
  );

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}` as any)}
      className="bg-white rounded-2xl mb-4 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
        opacity: property.is_sold ? 0.6 : 1,
      }}
      activeOpacity={0.92}
    >
      {/* Image */}
      <View>
        <Image
          source={{ uri: property.images[0] }}
          style={{ width: "100%", height: 160 }}
          resizeMode="cover"
        />

        {/* Badges on image */}
        <View className="absolute top-3 left-3 right-3 flex-row justify-between items-center">
          <View className="bg-white/90 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-blue-600 capitalize">
              {property.type}
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleSave}
            disabled={saveLoading}
            className="w-8 h-8 bg-white/90 rounded-full items-center justify-center"
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={16}
              color={isSaved ? "#EF4444" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {property.is_sold && (
          <View className="absolute bottom-3 left-3 bg-red-500 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">Sold</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View className="p-3">
        <Text
          className="text-sm font-bold text-gray-900 mb-1"
          numberOfLines={1}
        >
          {property.title}
        </Text>

        <View className="flex-row items-center gap-1 mb-2.5">
          <Ionicons name="location-outline" size={11} color="#9CA3AF" />
          <Text className="text-xs text-gray-400 flex-1" numberOfLines={1}>
            {property.address}, {property.city}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-blue-600 font-bold text-base">
            {formatPrice(property.price)}
          </Text>

          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500">{property.bedrooms} bd</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500">{property.bathrooms} ba</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-500">{property.area_sqft} ft²</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
