import React from "react";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Clock, Eye, MessageSquare, Heart } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

import { Need } from "@/types";
import Colors from "@/constants/colors";
import { formatDistanceToNow } from "@/utils/date";
import { formatCurrency } from "@/utils/currency";
import { categories } from "@/constants/categories";

type NeedCardProps = {
  need: Need;
  compact?: boolean;
};

export default function NeedCard({ need, compact = false }: NeedCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const categoryName = categories.find(c => c.id === need.category)?.name || "その他";

  const handlePress = () => {
    router.push(`/need/${need.id}`);
  };

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <Pressable 
      style={[
        styles.container, 
        isPressed && styles.containerPressed,
        compact && styles.compactContainer
      ]} 
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: need.images[0] }}
          style={[styles.image, compact && styles.compactImage]}
          contentFit="cover"
          transition={200}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent']}
          style={styles.imageGradient}
        />
        <Pressable 
          style={styles.favoriteButton} 
          onPress={toggleFavorite}
          hitSlop={10}
        >
          <Heart 
            size={18} 
            color={isFavorite ? Colors.light.error : "#FFFFFF"} 
            fill={isFavorite ? Colors.light.error : "transparent"} 
          />
        </Pressable>
      </View>
      
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
        
        <Text style={[styles.title, compact && styles.compactTitle]} numberOfLines={compact ? 1 : 2}>
          {need.title}
        </Text>
        
        <Text style={styles.budget}>
          {formatCurrency(need.budget.min)} ~ {formatCurrency(need.budget.max)}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Clock size={14} color={Colors.light.subtext} />
            <Text style={styles.footerText}>
              {formatDistanceToNow(new Date(need.deadline))}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <MessageSquare size={14} color={Colors.light.subtext} />
            <Text style={styles.footerText}>{need.entryCount}</Text>
          </View>
          <View style={styles.footerItem}>
            <Eye size={14} color={Colors.light.subtext} />
            <Text style={styles.footerText}>{need.viewCount}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.statusBadge, getStatusStyle(need.status)]}>
        <Text style={styles.statusText}>{getStatusText(need.status)}</Text>
      </View>
    </Pressable>
  );
}

function getStatusStyle(status: Need["status"]) {
  switch (status) {
    case "open":
      return styles.statusOpen;
    case "in-progress":
      return styles.statusInProgress;
    case "completed":
      return styles.statusCompleted;
    case "cancelled":
      return styles.statusCancelled;
    default:
      return styles.statusOpen;
  }
}

function getStatusText(status: Need["status"]) {
  switch (status) {
    case "open":
      return "募集中";
    case "in-progress":
      return "進行中";
    case "completed":
      return "完了";
    case "cancelled":
      return "キャンセル";
    default:
      return "募集中";
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  compactContainer: {
    flexDirection: "row",
    height: 100,
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  compactImage: {
    width: 100,
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  content: {
    padding: 16,
  },
  compactContent: {
    flex: 1,
    padding: 12,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  budget: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.subtext,
    marginLeft: 4,
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 1,
  },
  statusOpen: {
    backgroundColor: Colors.light.primary,
  },
  statusInProgress: {
    backgroundColor: Colors.light.warning,
  },
  statusCompleted: {
    backgroundColor: Colors.light.success,
  },
  statusCancelled: {
    backgroundColor: Colors.light.error,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});