import FeaturedCard from "../../../components/FeaturedCard";
import PropertyCard from "../../../components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning ☀️";
  if (hour < 17) return "Good afternoon 👋";
  return "Good evening 🌙";
}

function SkeletonCard() {
  return (
    <View className="bg-white rounded-2xl mb-4 overflow-hidden">
      <View className="w-full h-40 bg-gray-200" />
      <View className="p-3 gap-2">
        <View className="h-4 bg-gray-200 rounded-full w-3/4" />
        <View className="h-3 bg-gray-100 rounded-full w-1/2" />
        <View className="h-4 bg-gray-200 rounded-full w-1/3 mt-1" />
      </View>
    </View>
  );
}

function FeaturedSkeleton() {
  return (
    <View className="w-72 mr-4 rounded-3xl overflow-hidden bg-white">
      <View style={{ height: 220 }} className="bg-gray-200" />
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  const fetchProperties = async () => {
    setLoading(true);

    const [{ data: featuredData }, { data: recommendedData }] =
      await Promise.all([
        supabase
          .from("properties")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("properties")
          .select("*")
          .eq("is_featured", false)
          .order("created_at", { ascending: false }),
      ]);

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={loading ? (Array(3).fill(null) as null[]) : recommended}
        keyExtractor={(item, i) => (item ? item.id : `skeleton-${i}`)}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
              <Image
                source={require("../../../assets/images/Kribb.png")}
                style={{ width: 90, height: 36 }}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/profile")}
                className="items-end"
              >
                <Text className="text-gray-400 text-xs">{getGreeting()}</Text>
                <Text className="text-gray-900 text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <TouchableOpacity
              onPress={() => router.push("/(root)/(tabs)/search")}
              className="mx-5 mb-5 flex-row items-center bg-white rounded-2xl px-4 py-3.5 gap-3 border border-gray-100"
            >
              <Ionicons name="search-outline" size={18} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm flex-1">
                Search properties, cities...
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/search?openFilters=true")
                }
                className="w-8 h-8 bg-blue-600 rounded-xl items-center justify-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured Section */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between px-5 mb-4">
                <Text className="text-gray-900 text-lg font-bold">
                  Featured
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(root)/(tabs)/search")}
                >
                  <Text className="text-blue-600 text-sm font-semibold">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <FlatList
                  data={[1, 2]}
                  keyExtractor={(i) => String(i)}
                  renderItem={() => <FeaturedSkeleton />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  scrollEnabled={false}
                />
              ) : featured.length === 0 ? (
                <View className="px-5">
                  <Text className="text-gray-400 text-sm">
                    No featured properties
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Recommended Header */}
            <View className="flex-row items-center justify-between px-5 mb-4">
              <Text className="text-gray-900 text-lg font-bold">
                Recommended
              </Text>
              {!loading && (
                <Text className="text-gray-400 text-sm">
                  {recommended.length} listings
                </Text>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) =>
          item ? (
            <View className="px-5">
              <PropertyCard property={item} />
            </View>
          ) : (
            <View className="px-5">
              <SkeletonCard />
            </View>
          )
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Ionicons name="home-outline" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 mt-3">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
