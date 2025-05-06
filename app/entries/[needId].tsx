import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Filter, SlidersHorizontal } from "lucide-react-native";

import Colors from "@/constants/colors";
import { mockEntries } from "@/mocks/entries";
import { mockNeeds } from "@/mocks/needs";
import EntryCard from "@/components/EntryCard";
import { Need } from "@/types";

export default function EntriesListScreen() {
  const { needId } = useLocalSearchParams<{ needId: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [need, setNeed] = useState<Need | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high">("recent");

  useEffect(() => {
    // Find the need
    const foundNeed = mockNeeds.find((n) => n.id === needId);
    setNeed(foundNeed || null);

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [needId]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>提案を読み込み中...</Text>
      </View>
    );
  }

  if (!need) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>ニーズが見つかりませんでした</Text>
      </View>
    );
  }

  // Filter entries for this need
  const entries = mockEntries.filter((entry) => entry.needId === needId);

  // Sort entries
  const sortedEntries = [...entries].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "price-low") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const handleSortChange = (sort: "recent" | "price-low" | "price-high") => {
    setSortBy(sort);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "提案一覧" }} />
      
      <View style={styles.needInfoContainer}>
        <Text style={styles.needInfoTitle} numberOfLines={1}>{need.title}</Text>
        <Text style={styles.entriesCount}>{entries.length}件の提案</Text>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>並び替え:</Text>
        <View style={styles.sortButtons}>
          <Pressable
            style={[styles.sortButton, sortBy === "recent" && styles.activeSortButton]}
            onPress={() => handleSortChange("recent")}
          >
            <Text
              style={[styles.sortButtonText, sortBy === "recent" && styles.activeSortButtonText]}
            >
              新着順
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === "price-low" && styles.activeSortButton]}
            onPress={() => handleSortChange("price-low")}
          >
            <Text
              style={[styles.sortButtonText, sortBy === "price-low" && styles.activeSortButtonText]}
            >
              価格が安い順
            </Text>
          </Pressable>
          <Pressable
            style={[styles.sortButton, sortBy === "price-high" && styles.activeSortButton]}
            onPress={() => handleSortChange("price-high")}
          >
            <Text
              style={[styles.sortButtonText, sortBy === "price-high" && styles.activeSortButtonText]}
            >
              価格が高い順
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={sortedEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EntryCard entry={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>まだ提案はありません</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.subtext,
  },
  needInfoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  needInfoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  entriesCount: {
    fontSize: 14,
    color: Colors.light.subtext,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: "row",
    flex: 1,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors.light.background,
  },
  activeSortButton: {
    backgroundColor: Colors.light.primaryLight,
  },
  sortButtonText: {
    fontSize: 13,
    color: Colors.light.subtext,
    fontWeight: "500",
  },
  activeSortButtonText: {
    color: Colors.light.primary,
    fontWeight: "700",
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.subtext,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.light.error,
    textAlign: "center",
    marginTop: 24,
  },
});