import React from "react";
import { StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Star } from "lucide-react-native";

import { Entry } from "@/types";
import Colors from "@/constants/colors";
import { formatCurrency } from "@/utils/currency";
import { formatDistanceToNow } from "@/utils/date";
import UserAvatar from "./UserAvatar";
import { mockUsers } from "@/mocks/users";

type EntryCardProps = {
  entry: Entry;
};

export default function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = React.useState(false);
  const user = mockUsers.find((u) => u.id === entry.userId);

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
    router.push(`/entry/${entry.id}`);
  };

  if (!user) return null;

  return (
    <Pressable 
      style={[styles.container, isPressed && styles.containerPressed]} 
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={styles.header}>
        <View style={styles.userSection}>
          <UserAvatar user={user} size={44} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <View style={styles.userMeta}>
              <View style={styles.ratingContainer}>
                <Star size={12} color={Colors.light.warning} fill={Colors.light.warning} />
                <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
              </View>
              <Text style={styles.timeAgo}>
                {formatDistanceToNow(new Date(entry.createdAt))}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>提案価格</Text>
          <Text style={styles.price}>{formatCurrency(entry.price)}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {entry.description}
      </Text>

      {entry.images.length > 0 && (
        <Image
          source={{ uri: entry.images[0] }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      )}

      <View style={styles.footer}>
        <View
          style={[styles.statusBadge, getStatusStyle(entry.status)]}
        >
          <Text style={[styles.statusText, getStatusTextStyle(entry.status)]}>
            {getStatusText(entry.status)}
          </Text>
        </View>
        <Text style={styles.viewDetailsText}>詳細を見る</Text>
      </View>
    </Pressable>
  );
}

function getStatusStyle(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return styles.statusPending;
    case "accepted":
      return styles.statusAccepted;
    case "rejected":
      return styles.statusRejected;
    default:
      return styles.statusPending;
  }
}

function getStatusTextStyle(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return styles.statusPendingText;
    case "accepted":
      return styles.statusAcceptedText;
    case "rejected":
      return styles.statusRejectedText;
    default:
      return styles.statusPendingText;
  }
}

function getStatusText(status: Entry["status"]) {
  switch (status) {
    case "pending":
      return "審査中";
    case "accepted":
      return "採用";
    case "rejected":
      return "不採用";
    default:
      return "審査中";
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginLeft: 4,
    fontWeight: "600",
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.light.subtext,
  },
  priceContainer: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: Colors.light.primary,
    fontWeight: "600",
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.light.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: Colors.light.warningLight,
  },
  statusAccepted: {
    backgroundColor: Colors.light.successLight,
  },
  statusRejected: {
    backgroundColor: Colors.light.errorLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusPendingText: {
    color: Colors.light.warning,
  },
  statusAcceptedText: {
    color: Colors.light.success,
  },
  statusRejectedText: {
    color: Colors.light.error,
  },
  viewDetailsText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
});