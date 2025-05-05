import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, RefreshControl, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronRight, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "@/constants/colors";
import { mockNeeds } from "@/mocks/needs";
import NeedCard from "@/components/NeedCard";
import CategoryList from "@/components/CategoryList";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [refreshing, setRefreshing] = useState(false);

  const filteredNeeds = selectedCategory
    ? mockNeeds.filter((need) => need.category === selectedCategory)
    : mockNeeds;

  // Show only the first 5 needs on the home screen
  const displayNeeds = filteredNeeds.slice(0, 5);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCreateNeed = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/create-need");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.imgur.com/hJJtoqy.jpeg" }}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.appName}>ダチオク</Text>
      </View>

      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2787&auto=format&fit=crop",
          }}
          style={styles.bannerImage}
          contentFit="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>欲しいものを投稿して、最高の提案を見つけよう</Text>
          <Text style={styles.bannerSubtitle}>
            あなたのニーズに合った製品やサービスを提供してくれる人を見つけましょう
          </Text>
          <Pressable style={styles.bannerButton} onPress={handleCreateNeed}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.bannerButtonText}>ニーズを投稿する</Text>
          </Pressable>
        </View>
      </View>

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? "カテゴリー内のニーズ" : "最新のニーズ"}
          </Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.seeAllText}>すべて見る</Text>
            <ChevronRight size={16} color={Colors.light.primary} />
          </Pressable>
        </View>

        <View style={styles.needsContainer}>
          {displayNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <LinearGradient
          colors={[Colors.light.primaryLight, Colors.light.background]}
          style={styles.sectionBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>人気のニーズ</Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push("/popular")}
          >
            <Text style={styles.seeAllText}>すべて見る</Text>
            <ChevronRight size={16} color={Colors.light.primary} />
          </Pressable>
        </View>

        <View style={styles.popularContainer}>
          {mockNeeds
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, 3)
            .map((need) => (
              <NeedCard key={need.id} need={need} />
            ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>アート作品のニーズ</Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push("/category/4")}
          >
            <Text style={styles.seeAllText}>すべて見る</Text>
            <ChevronRight size={16} color={Colors.light.primary} />
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {mockNeeds
            .filter(need => need.category === "4")
            .slice(0, 5)
            .map((need) => (
              <View key={need.id} style={styles.horizontalCardContainer}>
                <NeedCard need={need} />
              </View>
            ))}
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <LinearGradient
          colors={[Colors.light.secondaryLight, Colors.light.background]}
          style={styles.sectionBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>子供服のニーズ</Text>
          <Pressable 
            style={styles.seeAllButton}
            onPress={() => router.push("/category/2")}
          >
            <Text style={styles.seeAllText}>すべて見る</Text>
            <ChevronRight size={16} color={Colors.light.primary} />
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContent}
        >
          {mockNeeds
            .filter(need => need.category === "2" && need.title.includes("子供"))
            .slice(0, 5)
            .map((need) => (
              <View key={need.id} style={styles.horizontalCardContainer}>
                <NeedCard need={need} />
              </View>
            ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    justifyContent: "flex-end",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 6,
  },
  sectionContainer: {
    marginTop: 24,
    marginBottom: 8,
    position: "relative",
    paddingVertical: 16,
    borderRadius: 16,
  },
  sectionBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.5,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
    marginRight: 4,
  },
  needsContainer: {
    paddingHorizontal: 16,
  },
  popularContainer: {
    paddingHorizontal: 16,
  },
  horizontalScrollContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  horizontalCardContainer: {
    width: 280,
    marginRight: 12,
  },
});