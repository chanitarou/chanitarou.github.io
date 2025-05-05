import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Platform } from "react-native";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { mockNeeds } from "@/mocks/needs";
import NeedCard from "@/components/NeedCard";
import CategoryList from "@/components/CategoryList";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "budget">("recent");

  // Simulate loading when search or filters change
  useEffect(() => {
    if (searchQuery || selectedCategory) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, selectedCategory, sortBy]);

  const filteredNeeds = mockNeeds.filter((need) => {
    const matchesCategory = selectedCategory
      ? need.category === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? need.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        need.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Sort the filtered needs
  const sortedNeeds = [...filteredNeeds].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "popular") {
      return b.viewCount - a.viewCount;
    } else {
      // Sort by budget (highest max budget first)
      return b.budget.max - a.budget.max;
    }
  });

  const handleClearSearch = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setSearchQuery("");
  };

  const handleSortChange = (sort: "recent" | "popular" | "budget") => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    setSortBy(sort);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <SearchIcon size={20} color={Colors.light.subtext} />
            <TextInput
              style={styles.searchInput}
              placeholder="ニーズを検索..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.subtext}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch} hitSlop={8}>
                <X size={20} color={Colors.light.subtext} />
              </Pressable>
            )}
          </View>
          
          <Pressable style={styles.filterButton}>
            <SlidersHorizontal size={20} color={Colors.light.primary} />
          </Pressable>
        </View>

        <View style={styles.categoryContainer}>
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            compact={true}
          />
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
              style={[styles.sortButton, sortBy === "popular" && styles.activeSortButton]}
              onPress={() => handleSortChange("popular")}
            >
              <Text
                style={[styles.sortButtonText, sortBy === "popular" && styles.activeSortButtonText]}
              >
                人気順
              </Text>
            </Pressable>
            <Pressable
              style={[styles.sortButton, sortBy === "budget" && styles.activeSortButton]}
              onPress={() => handleSortChange("budget")}
            >
              <Text
                style={[styles.sortButtonText, sortBy === "budget" && styles.activeSortButtonText]}
              >
                予算順
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {isLoading ? "検索中..." : `${sortedNeeds.length}件の結果`}
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : (
          <FlatList
            data={sortedNeeds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NeedCard need={item} />}
            contentContainerStyle={styles.needsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  該当するニーズが見つかりませんでした
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  topContainer: {
    backgroundColor: Colors.light.card,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  categoryContainer: {
    marginTop: 0,
    paddingBottom: 0,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginRight: 12,
  },
  sortButtons: {
    flexDirection: "row",
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 12,
  },
  needsList: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
});