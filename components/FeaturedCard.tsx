import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Property } from "@/types";
import { formatPrice } from "../lib/utils";

export default function FeaturedCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}` as any)}
      className="w-72 mr-4 rounded-3xl overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
      }}
      activeOpacity={0.92}
    >
      {/* Full image */}
      <Image
        source={{ uri: property.images[0] }}
        style={{ width: "100%", height: 220 }}
        resizeMode="cover"
      />

      {/* Gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.72)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
        }}
      />

      {/* Top badges */}
      <View className="absolute top-3 left-3 right-3 flex-row justify-between items-center">
        <View className="bg-white/90 px-3 py-1 rounded-full">
          <Text className="text-xs font-bold text-blue-600 capitalize">
            {property.type}
          </Text>
        </View>
        {property.is_sold && (
          <View className="bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">Sold</Text>
          </View>
        )}
        {property.is_featured && !property.is_sold && (
          <View className="bg-amber-400 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-white">⭐ Featured</Text>
          </View>
        )}
      </View>

      {/* Bottom info over gradient */}
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
          {property.title}
        </Text>

        <View className="flex-row items-center gap-1 mb-2">
          <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.75)" />
          <Text className="text-white/75 text-xs flex-1" numberOfLines={1}>
            {property.address}, {property.city}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-white font-bold text-lg">
            {formatPrice(property.price)}
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 text-xs">{property.bedrooms}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="water-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 text-xs">{property.bathrooms}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={13} color="rgba(255,255,255,0.8)" />
              <Text className="text-white/80 text-xs">{property.area_sqft} ft²</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
