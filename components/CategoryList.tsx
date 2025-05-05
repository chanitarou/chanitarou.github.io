import React from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Home, Shirt, Smartphone, Palette, Utensils, Sofa, Dumbbell, MoreHorizontal } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Colors from "@/constants/colors";
import { categories } from "@/constants/categories";

type CategoryListProps = {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
  compact?: boolean;
};

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
  compact = false,
}: CategoryListProps) {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    
    if (selectedCategory === categoryId) {
      // Deselect if already selected
      if (onSelectCategory) {
        onSelectCategory(undefined);
      }
    } else {
      if (onSelectCategory) {
        onSelectCategory(categoryId);
      } else {
        router.push(`/category/${categoryId}`);
      }
    }
  };

  const renderIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case "sofa":
        return <Sofa size={compact ? 18 : 24} color={color} />;
      case "shirt":
        return <Shirt size={compact ? 18 : 24} color={color} />;
      case "smartphone":
        return <Smartphone size={compact ? 18 : 24} color={color} />;
      case "palette":
        return <Palette size={compact ? 18 : 24} color={color} />;
      case "utensils":
        return <Utensils size={compact ? 18 : 24} color={color} />;
      case "home":
        return <Home size={compact ? 18 : 24} color={color} />;
      case "dumbbell":
        return <Dumbbell size={compact ? 18 : 24} color={color} />;
      case "more-horizontal":
        return <MoreHorizontal size={compact ? 18 : 24} color={color} />;
      default:
        return <MoreHorizontal size={compact ? 18 : 24} color={color} />;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, compact && styles.compactContainer]}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const iconColor = isSelected
          ? Colors.light.primary
          : Colors.light.subtext;

        return (
          <Pressable
            key={category.id}
            style={[
              styles.categoryItem,
              compact && styles.compactCategoryItem,
              isSelected && styles.selectedCategoryItem,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View
              style={[
                styles.iconContainer,
                compact && styles.compactIconContainer,
                isSelected && styles.selectedIconContainer,
              ]}
            >
              {renderIcon(category.icon, iconColor)}
            </View>
            <Text
              style={[
                styles.categoryName,
                compact && styles.compactCategoryName,
                isSelected && styles.selectedCategoryName,
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  compactContainer: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  compactCategoryItem: {
    marginRight: 12,
    width: 60,
  },
  selectedCategoryItem: {},
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  compactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 4,
  },
  selectedIconContainer: {
    backgroundColor: Colors.light.primaryLight,
    borderColor: Colors.light.primary,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.subtext,
    textAlign: "center",
  },
  compactCategoryName: {
    fontSize: 10,
  },
  selectedCategoryName: {
    color: Colors.light.primary,
    fontWeight: "700",
  },
});